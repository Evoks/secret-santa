import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [UsersModule],
	controllers: [AuthController],
	providers: [AuthService, UsersService, JwtService],
})
export class AuthModule {}
