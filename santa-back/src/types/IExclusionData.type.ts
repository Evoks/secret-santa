import IUser from './IUser.type';

export default interface IExclusionData {
	userId: string;
	excludedUsers: IUser[];
}
