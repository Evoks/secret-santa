import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { UsersService } from 'src/modules/users/users.service';

@Module({
	imports: [],
	controllers: [GroupController],
	providers: [GroupService, UsersService],
})
export class GroupModule {}
