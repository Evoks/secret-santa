import User from "./User";

type FormGroupCreationState = {
	groupName: string;
	dueDate: Date;
	mainUserId: string,
	users: User[];
	stepIdx: number;
	createAccount: boolean;
}

export default FormGroupCreationState;