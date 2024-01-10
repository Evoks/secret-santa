import User from './User';

type Group = {
	_id: string;
	name: string;
	mainUser: User;
	users: User[];
	exclusions: {
		userId: string; // _id of the user
		excludedUsers: string[]; // name of the excluded users
	}[];
	associations: {
		userId: string; // _id of the user
		associatedUser: string; // name of the associated user
	}[];
	dueDate: Date;
}

export default Group;