import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { UsersService } from '../users/users.service';
import IGroupData from 'src/types/IGroup.type';
import IUser from 'src/types/IUser.type';
import CustomError from 'src/helpers/classes/CustomError.class';
import { AuthService } from '../auth/auth.service';

@Controller()
export class GroupController {
	constructor(
		private readonly groupService: GroupService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	@Post()
	async create(@Body() groupData: IGroupData) {
		try {
			const group = await this.groupService.create({
				name: groupData.name,
				mainUser: groupData.mainUser,
				users: groupData.users,
				exclusions: groupData.exclusions,
				associations: groupData.associations,
				dueDate: groupData.dueDate,
			});
			return { success: true, data: group };
		} catch (e) {
			console.error(`GroupController -  create`, e);
			if (e instanceof CustomError) {
				return { success: false, message: e.message };
			}
			return { success: false, message: 'Internal server error' };
		}
	}

	@Get()
	async findAll(@Query() query: { skip: number; limit: number }) {
		try {
			const groups = await this.groupService.findAll(query.skip, query.limit);
			return { success: true, data: groups };
		} catch (e) {
			console.error(`GroupController -  findAll`, e);
			return { success: false, message: 'Internal server error' };
		}
	}

	@Get('/user')
	async findAllGroupsFromUser(
		@Query() authDto: Record<string, any>,
		@Query() query: { skip: number; limit: number },
	) {
		try {
			const authuser = authDto.access_token ? await this.authService.checkAuth(authDto.access_token) : null;
			if (!authuser) {
				return { success: false, message: 'User not found' };
			}
			const groups = await this.groupService.findAllGroupsFromUser(authuser._id, query.skip, query.limit);
			// remove associations and exclusions
			groups.forEach((g: any) => {
				g.associations = undefined;
				g.exclusions = undefined;
			});
			return { success: true, data: groups };
		} catch (e) {
			console.error(`GroupController -  findAll`, e);
			return { success: false, message: 'Internal server error' };
		}
	}

	@Get('check/:id')
	async check(@Param('id') id: string) {
		try {
			const groupDB = await this.groupService.findOne(id, null);
			if (!groupDB) {
				return { success: false, message: 'Group not found' };
			} else {
				const users = groupDB.users.map((u: IUser) => {
					const userDB = groupDB.users.find((uDB: IUser) => uDB._id === u._id);
					return {
						_id: userDB._id,
						name: userDB.name,
						registered: userDB.registered,
					};
				});
				return { success: true, users };
			}
		} catch (e) {
			console.error(`GroupController - findOne`, e);
			if (e instanceof CustomError) {
				return { success: false, message: e.message };
			}
			return { success: false, message: 'Internal server error' };
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string, @Query() authDto: Record<string, any>) {
		try {
			const authuser = authDto.access_token ? await this.authService.checkAuth(authDto.access_token) : null;
			const group = await this.groupService.findOne(id, authuser);
			return { success: true, data: group };
		} catch (e) {
			console.error(`GroupController - findOne`, e);
			if (e instanceof CustomError) {
				return { success: false, message: e.message };
			}
			return { success: false, message: 'Internal server error' };
		}
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Query() authDto: Record<string, any>,
		@Body()
		updateGroupData: IGroupData,
	) {
		try {
			const authuser = authDto.access_token ? await this.authService.checkAuth(authDto.access_token) : null;
			if (!authuser) {
				return { success: false, message: 'Invalid credentials' };
			}
			// check if the user is the mainUser
			const group = await this.groupService.findOne(id, authuser);
			if (!group) {
				return { success: false, message: 'Group not found' };
			}
			const updatedGroup = await this.groupService.update(id, updateGroupData);
			return { success: true, data: updatedGroup };
		} catch (e) {
			console.error(`GroupController -  updateGroupData`, e);
			return { success: false, message: 'Internal server error' };
		}
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			await this.groupService.remove(id);
			return { success: true };
		} catch (e) {
			console.error(`GroupController -  remove`, e);
			return { success: false, message: 'Internal server error' };
		}
	}
}
