import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [],
	controllers: [UsersController],
	providers: [UsersService, AuthService, JwtService],
})
export class UsersModule {}
