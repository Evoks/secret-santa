import User from "./User";

type FormGroupCreationState = {
	groupName: string;
	dueDate: Date;
	mainUser: User,
	users: User[];
	stepIdx: number;
	createAccount: boolean;
}

export default FormGroupCreationState;