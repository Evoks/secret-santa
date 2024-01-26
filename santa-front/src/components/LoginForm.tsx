import { useContext, useEffect, useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../services/auth.service';
import { AuthContext } from '../contexts/AuthContext';
import emailRegex from '../helpers/email.regex';
import AuthActions from '../types/AuthActions.enum';
import { ToastContext } from '../contexts/ToastContext';
import Title from './Title';
import InputPassword from './InputPassword';
import FormGroupCreationActions from '../types/FormGroupCreationActions.enum';
import User from '../types/User';
import React from 'react';

type LoginFormProps = {
	state?: any;
	includeForm?: boolean,
	includeCard?: boolean,
	includeTitle?: boolean,
	dispatchState?: any;
	displayButton: boolean;
	handleSubmitCallback?: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ state, dispatchState, displayButton, handleSubmitCallback, includeTitle = false, includeCard = false, includeForm = true }: any) => {
	const { setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [ mainUser, setMainUser ] = useState<User>(state.users ? state.users[0] : state.user);

	useEffect(() => {
		setMainUser(state.users ? state.users[0] : state.user);
	}, [state.users, state.user]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const setStateValue = (value: string, property: string) => {
		// if the state is the state of the form group creation
		if (state.users) {
			dispatchState({ type: FormGroupCreationActions.UPDATE_USER, payload: { index: 0, [property]: value } });
		} else if (state.user) { // if the state is the state of the login form
			dispatchState({ type: AuthActions.UPDATE_USER_ID, payload: { [property]: value } });
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			let success = true;
			setIsLoading(true);
			try {
				const userData = state.users ? state.users[0] : state.user;
				const userLoggedInData = await AuthService.logIn(userData.email, userData.password);
				if (userLoggedInData.success === false) {
					throw new Error('Une erreur est survenue lors de la connexion au compte');
				}
				setAuthUser(userLoggedInData.user);
			} catch (e: any) {
				addToast({ message: e?.message || 'Une erreur est survenue lors de la connexion', type: 'error' });
				success = false;
			}
			setIsLoading(false);
			await handleSubmitCallback(success);
		} catch (error) {
			console.error("Authentication error:", error);
		}
	}

	const formInputs = (
		<React.Fragment>
			<div className="mb-2 block">
				<Label htmlFor="email" value="Adresse email" />
			</div>
			<TextInput
				type="email"
				placeholder="Renseignez votre adresse email"
				value={mainUser.email}
				color={mainUser.email?.length === 0 || emailRegex.test(mainUser.email || '') ? 'gray' : 'failure'}
				onChange={(e) => setStateValue(e.target.value, 'email')}
				className="mb-2"
			/>
			<div className="mb-2 block">
				<Label htmlFor="password" value="Mot de passe" />
			</div>
			<InputPassword value={mainUser.password} setValue={setStateValue} property={'password'} />
			{
				displayButton &&
				<div className="w-full flex flex-row justify-center">
					<Button aria-label="Connexion" type="submit" disabled={isLoading} className="btn-primary mb-4">
						{isLoading ? (
							<FontAwesomeIcon icon={faSpinner} spin />
						) : (
							'Connexion'
						)}
					</Button>
				</div>
			}
		</React.Fragment>
	);

	const content = (
		<React.Fragment>
			{!includeForm &&
				<div className="w-full">
					{formInputs}
				</div>
			}
			{includeForm &&
				<form className="w-full" onSubmit={handleSubmit}>
					{formInputs}
				</form>
			}
		</React.Fragment>
	);

	return (
		<div className="w-full flex flex-col items-center">
			{includeTitle &&
				<Title title={"Connexion au compte"} subtitle={"Entrez vos identifiants"} />
			}
			{includeCard &&
				<Card className="bg-frosty w-full">
					{content}
				</Card>
			}
			{!includeCard &&
				<React.Fragment>
					{content}
				</React.Fragment>
			}
		</div>
	);
}

export default LoginForm;