import User from './User';

type Group = {
	_id: string;
	name: string;
	mainUser: User;
	users: User[];
	exclusions: {
		userId: User;
		excludedUsers: User[];
	}[];
	associations: {
		userId: User;
		associatedUser: User;
	}[];
	dueDate: Date;
}

export default Group;