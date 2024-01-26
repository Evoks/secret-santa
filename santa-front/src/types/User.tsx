// Define interfaces for the state
type User = {
	_id: string;
	name: string;
	email?: string;
	password?: string;
	excludedUsers: string[];
	authToken?: string;
	registered?: boolean;
}

export default User;