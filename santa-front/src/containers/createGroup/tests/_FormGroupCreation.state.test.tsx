import { formGroupCreationReducer, initialState } from '../FormGroupCreation.state';
import AuthActions from "../../../types/AuthActions.enum";
import FormGroupCreationActions from "../../../types/FormGroupCreationActions.enum";
import User from '../../../types/User';

jest.mock('../_FormGroupCreation.state', () => {
	const originalModule = jest.requireActual('../_FormGroupCreation.state');
	return {
		...originalModule,
		initialState : {
			groupName: 'Test',
			dueDate: new Date(),
			mainUser: { _id: null, name: '', password: '', email: '', excludedUsers: [] },
			users: [
				{ _id: null, name: 'Test', excludedUsers: [] },
				{ _id: null, name: 'Test2', excludedUsers: [] },
				{ _id: null, name: 'Test3', excludedUsers: [] }
			],
			stepIdx: 0,
			createAccount: false,
		}
	};
});

describe('formGroupCreationReducer', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should handle UPDATE_MAIN_USER action', () => {
		const action = {
			type: AuthActions.UPDATE_MAIN_USER,
			payload: { name: 'Updated User', email: 'updated@example.com' },
		};
		const newState = formGroupCreationReducer(initialState, action);
		expect(newState.mainUser.name).toBe('Updated User');
		expect(newState.mainUser.email).toBe('updated@example.com');
	});

	it('should handle ADD_USER action', () => {
		const action = { type: FormGroupCreationActions.ADD_USER, payload: undefined };
		const newState = formGroupCreationReducer(initialState, action);
		expect(newState.users).toHaveLength(initialState.users.length + 1);
	});

	it('should handle REMOVE_USER action', () => {
		const removeIndex = 1; // Index of 'Marcel'
		const action = {
			type: FormGroupCreationActions.REMOVE_USER,
			payload: { index: removeIndex },
		};
		const newState = formGroupCreationReducer(initialState, action);
		expect(newState.users).toHaveLength(initialState.users.length - 1);
		expect(newState.users.find((user: User) => user.name === 'Marcel')).toBeUndefined();
	});

	it('should handle UPDATE_USER action', () => {
		const updateIndex = 2; // Index of 'Antoinio'
		const action = {
			type: FormGroupCreationActions.UPDATE_USER,
			payload: { index: updateIndex, name: 'Antonio' },
		};
		const newState = formGroupCreationReducer(initialState, action);
		expect(newState.users[updateIndex].name).toBe('Antonio');
	});

	it('should return the current state when action is unknown', () => {
		const action = { type: 'UNKNOWN_ACTION', payload: undefined };
		const newState = formGroupCreationReducer(initialState, action);
		expect(newState).toEqual(initialState);
	});
});

