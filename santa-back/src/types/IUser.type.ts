export default interface IUser {
	_id: string;
	name: string;
	email: string | null;
	pwdHash: string | null;
	registrationToken: string | null;
	lastLogin: Date | null;
	registered: boolean;
}
