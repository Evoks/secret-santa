import IUser from './IUser.type';

export default interface IAssociationData {
	userId: string;
	associatedUser: IUser;
}
