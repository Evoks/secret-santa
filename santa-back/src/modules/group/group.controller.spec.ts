import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

describe('GroupController', () => {
	let groupController: GroupController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [GroupController],
			providers: [GroupService],
		}).compile();

		groupController = app.get<GroupController>(GroupController);
	});

	describe('Group controller', () => {
		it('should return a group"', () => {
			expect(groupController.findOne('1')).toBe('Group 1');
		});
	});
});
