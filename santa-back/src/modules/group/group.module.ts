import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [],
	controllers: [GroupController],
	providers: [GroupService, UsersService, AuthService, JwtService],
})
export class GroupModule {}
