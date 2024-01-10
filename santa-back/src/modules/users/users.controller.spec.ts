import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let userController: UsersController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		}).compile();

		userController = app.get<UsersController>(UsersController);
	});

	describe('User controller', () => {
		it('should return a user"', () => {
			expect(userController.findOne('1')).toBe('User 1');
		});
	});
});
