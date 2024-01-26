import AuthActions from "../../types/AuthActions.enum";
import User from "../../types/User";

type FormGroupFinderState = {
	groupName: string;
	dueDate: Date;
	mainUserId: string | null,
	users: User[];
	stepIdx: number;
	createAccount: boolean;
}

export const initialState: FormGroupFinderState = {
	groupName: 'Test',
	dueDate: new Date(),
	mainUserId: null,
	users: [],
	stepIdx: 0,
	createAccount: false,
};

export function formGroupCreationReducer(state: FormGroupFinderState, action: { type: string, payload: any }) {
	switch (action.type) {
		case AuthActions.UPDATE_USER_ID:
			return { ...state, mainUserId: action.payload };
		default:
			return state;
	}
}