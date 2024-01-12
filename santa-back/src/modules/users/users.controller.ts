import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import CustomError from 'src/helpers/classes/CustomError.class';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly authService: AuthService,
	) {}

	@Post()
	async create(@Body() userData: { name: string; email: string; password: string; userId?: string }) {
		try {
			const userDB = await this.userService.create(userData, this.authService);
			return {
				success: true,
				data: {
					_id: userDB._id,
				},
			};
		} catch (e) {
			if (e instanceof CustomError) {
				return { success: false, message: e.message };
			}
			console.error(`UserController -  create`, e);
			return { success: false, message: 'Internal server error' };
		}
	}

	@Get()
	async findAll(@Query() query: { skip: number; limit: number }) {
		return await this.userService.findAll(query.skip, query.limit);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.userService.findOneById(id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body()
		updateUserData: {
			name: string;
			email: string;
			oldPassword: string;
			newPassword: string;
			registrationToken: string;
		},
	) {
		try {
			return await this.userService.update(id, updateUserData);
		} catch (e) {
			if (e instanceof CustomError) {
				return { success: false, message: e.message };
			}
			console.error(`UserController -  update`, e);
			return { success: false, message: 'Internal server error' };
		}
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.userService.remove(id);
	}
}
