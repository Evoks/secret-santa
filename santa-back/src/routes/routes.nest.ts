import { UsersModule } from 'src/modules/users/users.module';
import { GroupModule } from '../modules/group/group.module';
import { AuthModule } from 'src/modules/auth/auth.module';

const routes = [
	{
		path: '/',
		children: [
			{
				path: 'group',
				module: GroupModule,
			},
			{
				path: 'user',
				module: UsersModule,
			},
			{
				path: 'auth',
				module: AuthModule,
			},
		],
	},
];

export default routes;
