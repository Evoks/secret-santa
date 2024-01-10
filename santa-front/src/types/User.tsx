// Define interfaces for the state
type User = {
	_id: string | null;
	name: string;
	email?: string | null;
	password?: string | null;
	excludedUsers: string[];
	authToken?: string;
	registered?: boolean;
}

export default User;