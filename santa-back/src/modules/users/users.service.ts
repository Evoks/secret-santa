import { Injectable } from '@nestjs/common';
import User from '../../models/user.model';
import { hashString } from 'src/helpers/functions/hashString.function';
import isValidObjectId from 'src/helpers/functions/isValidObjectId.function';
import validatePassword from 'src/helpers/functions/validatePassword.function';
import { v4 } from 'uuid';
import CustomError from 'src/helpers/classes/CustomError.class';
import IUser from 'src/types/IUser.type';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
	async _createUnregisteredUser(userData: { name: string }) {
		const user = new User({
			name: userData.name,
			registered: false,
			registrationToken: v4(),
		});
		try {
			await user.save();
			return user;
		} catch (err) {
			throw new Error(err);
		}
	}

	async _createRegisteredUser(userData: { name: string; email: string; password: string }) {
		validatePassword(userData.password);
		const hashedPassword = await hashString(userData.password);
		const user = new User({
			name: userData.name,
			email: userData.email,
			pwdHash: hashedPassword,
			registered: true,
		});
		try {
			await user.save();
			return user;
		} catch (err) {
			throw new Error(err);
		}
	}

	async create(userData: { name: string; email: string; password: string; userId?: string }, authService: any) {
		if (userData.email) {
			let userDB: IUser & mongoose.Document = null;
			// Check if the user already exists with email
			userDB = await User.findOne({ email: userData.email });
			if (!userDB) {
				// Check if the user already exists with userId
				if (userData.userId) {
					userDB = await User.findOne({ _id: new mongoose.Types.ObjectId(userData.userId) });
					if (userDB) {
						userDB.email = userData.email;
						userDB.registered = true;
						userDB.pwdHash = await hashString(userData.password);
						userDB.registrationToken = null;
						await userDB.save();
						return userDB;
					}
				}
				return await this._createRegisteredUser(userData);
			} else if (userData.password) {
				// we check the credentials
				const userChecked = await authService.checkCredentials(userData.email, userData.password);
				if (!userChecked) {
					throw new CustomError('User already exist, invalid credentials', 'checkCredentials');
				}
			}
			return userDB;
		} else {
			return await this._createUnregisteredUser(userData);
		}
	}

	async findAll(skip: number = 0, limit: number = 10) {
		const users = await User.find().skip(skip).limit(limit);
		return users;
	}

	async findOne(params: any) {
		const user = await User.findOne(params);
		return user;
	}

	async findOneById(id: string) {
		// validate the ID
		if (!isValidObjectId(id)) {
			throw new Error('Invalid ID');
		}
		const user = await User.findById(id);
		return user;
	}

	async update(
		id: string,
		updateUserData: {
			name: string;
			email: string;
			oldPassword: string;
			newPassword: string;
			registrationToken: string;
		},
	) {
		// Find the user by ID
		const user = await User.findById(id);
		if (!user) {
			throw new Error('User not found');
		}

		// Update the user properties
		if (updateUserData.name) {
			user.name = updateUserData.name;
		}
		if (updateUserData.email) {
			user.email = updateUserData.email;
		}
		// If the user is not yet registered, we can set a new password
		if (user.registrationToken && updateUserData.registrationToken === user.registrationToken) {
			if (updateUserData.newPassword) {
				validatePassword(updateUserData.newPassword);
				user.pwdHash = await hashString(updateUserData.newPassword);
				user.registered = true;
				user.registrationToken = null;
			}
		} else if (!user.registrationToken && updateUserData.oldPassword && updateUserData.newPassword) {
			// If the user is already registered, we can change the password
			if ((await hashString(updateUserData.oldPassword)) === user.pwdHash) {
				validatePassword(updateUserData.newPassword);
				user.pwdHash = await hashString(updateUserData.newPassword);
			} else {
				throw new Error('Invalid old password');
			}
		}
		// Save the updated user
		await user.save();

		// Optionally, return the updated user
		return user;
	}

	async remove(id: string) {
		await User.deleteOne({ _id: id });
		return;
	}
}
