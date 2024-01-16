import User from "./User";

type GroupManagerState = {
	_id: string;
	name?: string;
	users: User[];
	mainUser: User;
	exclusions: {
		userId: string;
		excludedUsers: string[];
	}[];
	dueDate: Date;
	associations: {
		userId: string,
		associatedUser: string;
	}[];
}

export default GroupManagerState;