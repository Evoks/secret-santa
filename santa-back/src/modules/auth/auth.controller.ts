import { Body, Controller, Post, Get, Res, UnauthorizedException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import CustomError from 'src/helpers/classes/CustomError.class';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async logIn(@Body() logInDto: Record<string, any>, @Res() res: any) {
		try {
			const authData = await this.authService.logIn(logInDto.email, logInDto.password);
			return res.status(200).send({ success: true, access_token: authData.access_token, user: authData.user });
		} catch (e) {
			console.error(`GroupController -  create`, e);
			if (e instanceof CustomError) {
				return res.status(401).send({ success: false, message: e.message });
			} else if (e instanceof UnauthorizedException) {
				return res.status(401).send({ success: false, message: 'Invalid credentials' });
			}
			return res.status(500).send({ success: false, message: 'Internal server error' });
		}
	}

	@Get('check')
	async checkAuth(@Query() authDto: Record<string, any>, @Res() res: any) {
		try {
			const verified = await this.authService.checkAuth(authDto.access_token);
			return res.status(200).send({ success: true, verified });
		} catch (e) {
			console.error(`GroupController -  create`, e);
			if (e instanceof CustomError) {
				return res.status(401).send({ success: false, message: e.message });
			} else if (e instanceof UnauthorizedException) {
				return res.status(401).send({ success: false, message: 'Invalid credentials' });
			}
			return res.status(500).send({ success: false, message: 'Internal server error' });
		}
	}
}
