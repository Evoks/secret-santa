import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import IUser from 'src/types/IUser.type';
import CustomError from 'src/helpers/classes/CustomError.class';
import { compareHashes } from 'src/helpers/functions/hashString.function';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async logIn(email: string, password: string) {
		const user = await this.checkCredentials(email, password);
		if (!user) {
			throw new CustomError('Invalid credentials', 'LogIn');
		}
		const payload = { _id: user._id, username: user.name };
		user.lastLogin = new Date();
		await user.save();
		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				lastLogin: user.lastLogin,
			},
			access_token: await this.jwtService.signAsync(payload, {
				secret: process.env.SECRET_KEY,
			}),
		};
	}

	async checkCredentials(email: string, password: string) {
		if (!email || !password) {
			throw new CustomError('Invalid credentials', 'checkCredentials');
		}
		const user: IUser & mongoose.Document = await this.usersService.findOne({ email: email });
		if (!user) {
			throw new CustomError('User not found', 'LogIn');
		}
		const compRes = await compareHashes(password, user.pwdHash);
		if (!compRes) {
			return null;
		}
		return user;
	}

	async checkAuth(token: string): Promise<IUser> {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch (e) {
			console.error(e);
			throw new UnauthorizedException();
		}
	}
}
