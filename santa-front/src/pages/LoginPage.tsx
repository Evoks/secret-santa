// create a Login component that will be used to login to the application
//
// Path: src/pages/Login.tsx

import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import LoginSignUpForm from '../components/LoginSignUpForm';
import AuthActions from '../types/AuthActions.enum';
import User from '../types/User';

type LoginSignUpReducerState = {
	user: User,
}

const initialState: LoginSignUpReducerState = {
	user: { _id: null, name: '', password: '', email: '', excludedUsers: [] },
};

function LoginSignUpReducer(state: LoginSignUpReducerState, action: { type: string, payload: any }) {
	switch (action.type) {
		case AuthActions.UPDATE_MAIN_USER:
			return { ...state, user: { ...state.user, ...action.payload } };
		default:
			return state;
	}
}

const LoginPage: React.FC = () => {
	const navigation = useNavigate();
	const [state, dispatchState] = useReducer(LoginSignUpReducer, initialState);

	const loginHandleSubmitCallback = async (success: boolean) => {
		if (success) {
			navigation('/');
		}
	}

	const signUpHandleSubmitCallback = async (success: boolean) => {
		if (success) {
			navigation('/');
		}
	}

	return (
		<>
			<LoginSignUpForm includeTitle={true} includeCard={true} displayButton={true} state={state} dispatchState={dispatchState} loginHandleSubmitCallback={loginHandleSubmitCallback} signUpHandleSubmitCallback={signUpHandleSubmitCallback} />
		</>
	);
}

export default LoginPage;