// create a Login component that will be used to login to the application
//
// Path: src/pages/Login.tsx

import { useNavigate } from 'react-router-dom';
import { Suspense, lazy, useReducer } from 'react';
import AuthActions from '../types/AuthActions.enum';
import User from '../types/User';
import { Loading } from '../components/structure';
const LoginSignUpForm = lazy(() => import('../components/LoginSignUpForm'));

type LoginSignUpReducerState = {
	user: User,
}

const initialState: LoginSignUpReducerState = {
	user: { _id: '', name: '', password: '', email: '', excludedUsers: [] },
};

function LoginSignUpReducer(state: LoginSignUpReducerState, action: { type: string, payload: any }) {
	switch (action.type) {
		case AuthActions.UPDATE_USER_ID:
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
		<Suspense fallback={<Loading />}>
			<LoginSignUpForm includeTitle={true} includeCard={true} displayButton={true} state={state} dispatchState={dispatchState} loginHandleSubmitCallback={loginHandleSubmitCallback} signUpHandleSubmitCallback={signUpHandleSubmitCallback} />
		</Suspense>
	);
}

export default LoginPage;