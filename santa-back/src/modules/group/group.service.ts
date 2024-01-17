import { Injectable } from '@nestjs/common';
import Group from '../../models/group.model';
import User from '../../models/user.model';
import isValidObjectId from 'src/helpers/functions/isValidObjectId.function';
import IGroupData from '../../types/IGroup.type';
import IUser from 'src/types/IUser.type';
import IExclusionData from 'src/types/IExclusionData.type';
import IAssociationData from 'src/types/IAssociationData.type';
import CustomError from '../../helpers/classes/CustomError.class';
import mongoose from 'mongoose';

const userDataFields = {
	_id: 1,
	name: 1,
	email: 1,
	registered: 1,
};

@Injectable()
export class GroupService {
	async create(groupData: IGroupData) {
		this._validateGroup(groupData);

		// create group with empty exclusion list
		// we have to have user ids to update the exclusion list
		const exclusions: IExclusionData[] = [];
		await Promise.all(
			groupData.exclusions.map(async (exclusion: any) => {
				if (exclusion.excludedUsers?.length > 0) {
					const user = await User.findById(new mongoose.Types.ObjectId(exclusion.userId));
					if (!user) {
						throw new CustomError(`User with _id ${exclusion.user._id} not found`, 'Group creation');
					}
					const excludedUsers = [];
					for (const userName of exclusion.excludedUsers) {
						const excludedUser = groupData.users.find((u) => u.name === userName);
						if (!excludedUser) {
							throw new CustomError(`User with name ${userName} not found`, 'Group creation');
						}
						excludedUsers.push(excludedUser._id);
					}
					exclusions.push({
						userId: user._id,
						excludedUsers,
					});
				}
			}),
		);
		// associate a user to each user
		const associations: IAssociationData[] = [];
		try {
			await Promise.all(
				groupData.users.map(async (groupUser: IUser) => {
					const userExcludedUsersList =
						exclusions.find((e) => e.userId === groupUser._id)?.excludedUsers.map((u: IUser) => u._id) ||
						[];
					const otherUsers = groupData.users.filter((u: IUser) => {
						return u._id !== groupUser._id;
					});
					// we need to exclude the user that are in the exclusion list and the user that are already associated
					const possibleAssociations = otherUsers.filter((otherUser: IUser) => {
						return (
							!userExcludedUsersList.includes(otherUser._id) &&
							!associations.some((a) => a.associatedUser._id === otherUser._id)
						);
					});
					if (possibleAssociations.length === 0) {
						return;
					}
					const randomIndex = Math.floor(Math.random() * possibleAssociations.length);
					const associatedUser = possibleAssociations[randomIndex];
					associations.push({
						userId: groupUser._id,
						associatedUser,
					});
				}),
			);
		} catch (e) {
			console.error(e, associations);
		}
		if (associations.length !== groupData.users.length) {
			throw new CustomError('Could not create group, cannot create associations object', 'Group creation');
		}

		const group = new Group({
			name: groupData.name,
			mainUser: groupData.mainUser,
			users: groupData.users,
			exclusions: exclusions,
			dueDate: groupData.dueDate,
			associations: associations,
		});
		try {
			await group.save();
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
		return group;
	}

	async findAll(skip: number = 0, limit: number = 10) {
		return await Group.find().skip(skip).limit(limit);
	}

	// find all groups from a user
	async findAllGroupsFromUser(userId: string, skip: number = 0, limit: number = 10) {
		const groups = await Group.find({
			$or: [
				{ mainUser: new mongoose.Types.ObjectId(userId) },
				{ 'users._id': new mongoose.Types.ObjectId(userId) },
			],
		});
		console.log({ groups }, new mongoose.Types.ObjectId(userId));
		return await Group.find({
			$or: [{ mainUser: userId }, { 'users._id': userId }],
		})
			.populate('mainUser', userDataFields)
			.populate('users', userDataFields)
			.populate('dueDate')
			.skip(skip)
			.limit(limit);
	}

	// find a group
	async findOne(id: string, authuser: IUser): Promise<IGroupData> {
		// validate the group ID
		if (!isValidObjectId(id)) {
			throw new CustomError('Invalid ID', 'Group findOne');
		}
		const group = await Group.findById(id)
			.populate('mainUser', userDataFields)
			.populate('users', userDataFields)
			.populate('dueDate')
			.populate('associations.userId', userDataFields)
			.populate('associations.associatedUser', userDataFields);
		// check if the user is in the group
		if (!group) {
			throw new CustomError('Group not found', 'Group findOne');
		}
		if (
			authuser &&
			authuser._id !== group.mainUser._id.toString() &&
			!group.users.some((u: IUser) => u._id.toString() === authuser._id)
		) {
			throw new CustomError('User not in the group', 'Group findOne');
		}
		// if the user is not the main user, we remove the exclusions and associations and keep only the user's one
		// if the user is not logged in, we remove the exclusions and associations
		// if the user is the main user, we let the exclusions and associations
		if (authuser && group.mainUser._id.toString() !== authuser._id) {
			group.associations = [group.associations.find((a: any) => a.userId._id.toString() === authuser._id)];
		} else if (!authuser) {
			group.exclusions = undefined;
			group.associations = undefined;
		}
		return group;
	}

	async update(_id: string, updateGroupData: IGroupData) {
		this._validateGroup(updateGroupData);

		// Validate each user ID
		const areValidIds = updateGroupData.users?.map((u: any) => u._id).every(isValidObjectId);
		if (!areValidIds) {
			throw new CustomError('Invalid user IDs');
		}

		// Find the group by ID
		const groupData: any = await Group.findById(_id);
		if (!groupData) {
			throw new CustomError('Group not found');
		}

		// Update the group properties
		groupData.name = updateGroupData.name;
		groupData.dueDate = updateGroupData.dueDate;
		groupData.users = updateGroupData.users?.map((u: any) => {
			return {
				_id: u._id,
				name: u.name,
			};
		});

		console.log({ updateGroupData, groupData });

		// Save the updated group
		await groupData.save();

		// Optionally, return the updated group
		return groupData;
	}

	async remove(id: string) {
		await Group.deleteOne({ _id: id });
		return;
	}

	_validateGroup(groupData: IGroupData) {
		// we need to check that group is valid
		if (groupData.name?.length < 3) {
			return new CustomError('Invalid group name', 'Group validation');
		}
		// check if the number of users is greater than 4 and even
		if (groupData.users?.length < 4 || groupData.users?.length % 2 !== 0) {
			return new CustomError('Invalid group', 'Group validation');
		}
	}
}
