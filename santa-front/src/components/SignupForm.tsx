// create a SignUp component that will be used to login to the application
//
// Path: src/pages/SignUp.tsx

import { useContext, useEffect, useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../services/auth.service';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';
import emailRegex from '../helpers/email.regex';
import AuthActions from '../types/AuthActions.enum';
import Title from './Title';
import InputPassword from './InputPassword';
import FormGroupCreationActions from '../types/FormGroupCreationActions.enum';
import User from '../types/User';
import passwordRegex from '../helpers/password.regex';
import React from 'react';

type SignUpFormProps = {
	state?: any;
	includeForm?: boolean,
	dispatchState?: any;
	includeTitle?: boolean;
	includeCard?: boolean;
	displayButton: boolean;
	handleSubmitCallback?: any;
	dispInputName?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ state, dispatchState, displayButton, handleSubmitCallback, dispInputName = true, includeTitle = false, includeCard = false, includeForm = true }: SignUpFormProps) => {
	const { setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [passwordCheck, setPasswordCheck] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [mainUser, setMainUser] = useState<User>(state.users ? state.users[0] : state.user);

	useEffect(() => {
		setMainUser(state.users ? state.users[0] : state.user);
	}, [state.users, state.user]);

	const setStateValue = (value: string, property: string) => {
		// if the state is the state of the form group creation
		if (state.users) {
			dispatchState({ type: FormGroupCreationActions.UPDATE_USER, payload: { index: 0, [property]: value } });
		} else if (state.user) { // if the state is the state of the login form
			dispatchState({ type: AuthActions.UPDATE_USER_ID, payload: { [property]: value } });
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mainUser.password !== passwordCheck) {
			addToast({ message: 'Les mots de passe ne correspondent pas', type: 'error' });
			return;
		}
		let success = true;
		setIsLoading(true);
		try {
			if (mainUser &&
				mainUser.email && !emailRegex.test(mainUser.email) &&
				mainUser.password && !passwordRegex.test(mainUser.password)) {
				const userLoggedIn = await AuthService.signUp(mainUser.name, mainUser.email, mainUser.password, mainUser._id);
				if (!userLoggedIn) {
					throw new Error('Une erreur est survenue lors de la création du compte');
				}
				setAuthUser(userLoggedIn);
			}
		} catch (e: any) {
			addToast({ message: e?.message || 'Une erreur est survenue lors de la création du compte', type: 'error' });
			success = false;
		}
		setIsLoading(false);
		await handleSubmitCallback(success);
	}

	const formInputs = (
		<React.Fragment>
			{dispInputName &&
				<React.Fragment>
					<div className="mb-2 block">
						<Label htmlFor="name" value="Nom" />
					</div>
					<TextInput
						type="name"
						placeholder="Renseignez votre nom"
						value={mainUser.name}
						onChange={(e) => setStateValue(e.target.value, 'email')}
						className="mb-2"
					/>
				</React.Fragment>
			}
			<div className="mb-2 block">
				<Label htmlFor="email" value="Adresse email" />
			</div>
			<TextInput
				type="email"
				placeholder="Renseignez votre adresse mail"
				value={mainUser.email}
				color={mainUser.email?.length === 0 || emailRegex.test(mainUser.email || '') ? 'gray' : 'failure'}
				onChange={(e) => setStateValue(e.target.value, 'email')}
				className="mb-2"
			/>
			<div className="mb-2 block">
				<Label htmlFor="password" value="Mot de passe" />
			</div>
			<InputPassword value={mainUser.password} setValue={setStateValue} property={'password'} />
			<div className="mb-2 text-xs text-gray-400">
				Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.
			</div>
			<div className="mb-2 block">
				<Label htmlFor="passwordCheck" value="Verification du mot de passe" />
			</div>
			<InputPassword
				value={passwordCheck}
				setValue={(value: string) => { setPasswordCheck(value) }}
				property={'passwordCheck'}
				validationFn={(value: string) => {
					return passwordRegex.test(value) && value === mainUser.password;
				}}
			/>
			{displayButton &&
				<div className="w-full flex flex-row justify-center">
					<Button aria-label="Créer un compte" type="submit" disabled={isLoading} className="btn-primary mb-4">
						{isLoading ? (
							<FontAwesomeIcon icon={faSpinner} spin />
						) : (
							'Créer un compte'
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
		<div className="flex flex-col items-center justify-center flex-1">
			{includeTitle &&
				<Title title={"Création de votre compte"} subtitle={"Créer un compte pour accéder à l'ensemble du service"} />
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

export default SignUpForm;