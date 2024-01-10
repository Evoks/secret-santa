import IUserData from './IUser.type';

export default interface IGroup {
	name: string;
	mainUser: IUserData;
	users: IUserData[];
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
