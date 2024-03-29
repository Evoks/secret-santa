// create a Login component that will be used to login to the application
//
// Path: src/pages/Login.tsx

import { useEffect, useState } from 'react';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import AuthActions from '../types/AuthActions.enum';
import React from 'react';

type LoginSignUpFormProps = {
	state?: any;
	includeForm?: boolean,
	includeTitle?: boolean;
	includeCard?: boolean;
	dispatchState?: any;
	displayButton: boolean;
	loginHandleSubmitCallback?: any;
	signUpHandleSubmitCallback?: any;
}

const formComponents: { [key: string]: React.FC<any> } = {
	login: LoginForm,
	signup: SignUpForm,
};

const LoginSignUpForm: React.FC<LoginSignUpFormProps> = ({ state, dispatchState, displayButton, loginHandleSubmitCallback, signUpHandleSubmitCallback, includeTitle = false, includeCard = false, includeForm = true }: LoginSignUpFormProps) => {
	const [formType, setFormType] = useState<string>('login');

	const FormComponent = formComponents[formType];
	const isLogin = formType === 'login';
	const buttonText = isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?";
	const handleButtonClick = () => setFormType(formType === 'login' ? 'signup' : 'login');

	useEffect(() => {
		dispatchState({ type: AuthActions.CHANGE_FORM_TYPE, payload: { createAccount: formType === 'signup' } });
	}, [dispatchState, formType]);

	return (
		<React.Fragment>
			{
				// login or signup form
			}
			<FormComponent includeForm={includeForm} includeCard={includeCard} includeTitle={includeTitle} state={state} dispatchState={dispatchState} displayButton={displayButton} handleSubmitCallback={loginHandleSubmitCallback} />
			{
				// handle button login / signup logic
			}
			<div className="w-full flex justify-center mt-4">
				<div className="w-fit btn btn-xs btn-frosty mx-auto" onClick={handleButtonClick}>
					{buttonText}
				</div>
			</div>
		</React.Fragment>
	);
}

export default LoginSignUpForm;