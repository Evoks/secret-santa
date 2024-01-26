import AuthActions from "../../types/AuthActions.enum";
import FormGroupCreationActions from "../../types/FormGroupCreationActions.enum";
import FormGroupCreationState from "../../types/FormGroupCreationState";
import User from "../../types/User";

export const initialState: FormGroupCreationState = {
	groupName: '',
	dueDate: new Date(),
	mainUserId: '',
	users: [
		{ _id: '', name: '', password: '', email: '', excludedUsers: [] },
		{ _id: '', name: '', excludedUsers: [] },
	],
	stepIdx: 0,
	createAccount: false,
};

export function formGroupCreationReducer(state: FormGroupCreationState, action: { type: string, payload: any }) {
	switch (action.type) {
		case AuthActions.UPDATE_USER_ID:
			return { ...state, mainUserId: action.payload };
		case AuthActions.CHANGE_FORM_TYPE:
			return { ...state, createAccount: action.payload.createAccount };
		case FormGroupCreationActions.ADD_USER:
			return { ...state, users: [...state.users, { _id: '', name: '', excludedUsers: [] } as User] };
		case FormGroupCreationActions.REMOVE_USER:
			return { ...state, users: state.users.filter((_, index) => index !== action.payload.index) };
		case FormGroupCreationActions.UPDATE_USER:
			return {
				...state,
				users: state.users.map((user: User, i: number) => {
					if (i === action.payload.index) {
						return { ...user, ...action.payload };
					}
					return user;
				})
			};
		case FormGroupCreationActions.UPDATE_USERS:
			return { ...state, users: action.payload.users };
		case FormGroupCreationActions.UPDATE_GROUP_NAME:
			return { ...state, groupName: action.payload.name };
		case FormGroupCreationActions.UPDATE_STEP:
			return { ...state, stepIdx: action.payload.stepIdx };
		case FormGroupCreationActions.UPDATE_DUE_DATE:
			return { ...state, dueDate: action.payload.dueDate };
		case FormGroupCreationActions.UPDATE_USER_EXCLUSION:
			const userIndex = state.users.findIndex((user: User) => user.name === action.payload.user.name);
			return {
				...state,
				users: state.users.map((user: User, i: number) => {
					if (i === userIndex) {
						return { ...user, excludedUsers: action.payload.excludedUsers };
					}
					return user;
				})
			};
		case FormGroupCreationActions.RESET:
			return initialState;
		default:
			return state;
	}
}