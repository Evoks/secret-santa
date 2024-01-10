// create a SignUp component that will be used to login to the application
//
// Path: src/pages/SignUp.tsx

import { useContext, useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../services/auth.service';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';
import emailRegex from '../helpers/email.regex';
import passwordRegex from '../helpers/password.regex';
import AuthActions from '../types/AuthActions.enum';
import Title from './Title';

type SignUpFormProps = {
	state?: any;
	includeForm?: boolean,
	dispatchState?: any;
	includeTitle?: boolean;
	includeCard?: boolean;
	propertyUserName?: string;
	displayButton: boolean;
	handleSubmitCallback?: any;
	dispInputName?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ state, dispatchState, displayButton, handleSubmitCallback, propertyUserName = 'user', dispInputName = true, includeTitle = false, includeCard = false, includeForm = true }: any) => {
	const { setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [passwordCheck, setPasswordCheck] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (state[propertyUserName].password !== passwordCheck) {
			addToast({ message: 'Les mots de passe ne correspondent pas', type: 'error' });
			return;
		}
		let success = true;
		setIsLoading(true);
		try {
			const userLoggedIn = await AuthService.signUp(state[propertyUserName].name, state[propertyUserName].email, state[propertyUserName].password);
			if (!userLoggedIn) {
				throw new Error('Une erreur est survenue lors de la création du compte');
			}
			setAuthUser(userLoggedIn);
		} catch (e: any) {
			addToast({ message: e?.message || 'Une erreur est survenue lors de la création du compte', type: 'error' });
			success = false;
		}
		setIsLoading(false);
		await handleSubmitCallback(success);
	}

	const formInputs = (
		<>
			{dispInputName &&
				<>
					<div className="mb-2 block">
						<Label htmlFor="name" value="Nom" />
					</div>
					<TextInput
						type="name"
						placeholder="Renseignez votre nom"
						value={state[propertyUserName].name}
						onChange={(e) => dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { name: e.target.value } })}
						className="mb-2"
					/>
				</>
			}
			<div className="mb-2 block">
				<Label htmlFor="email" value="Adresse email" />
			</div>
			<TextInput
				type="email"
				placeholder="Renseignez votre adresse mail"
				value={state[propertyUserName].email}
				color={state[propertyUserName].email.length === 0 || emailRegex.test(state[propertyUserName].email) ? 'gray' : 'failure'}
				onChange={(e) => dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { email: e.target.value } })}
				className="mb-2"
			/>
			<div className="mb-2 block">
				<Label htmlFor="password" value="Mot de passe" />
			</div>
			<TextInput
				type="password"
				placeholder="Renseignez un mot de passe"
				value={state[propertyUserName].password}
				color={state[propertyUserName].password.length === 0 || passwordRegex.test(state[propertyUserName].password) ? 'gray' : 'failure'}
				onChange={(e) => dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { password: e.target.value } })}
				className="mb-2"
			/>
			<div className="mb-2 text-xs text-gray-400">
				Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.
			</div>
			<div className="mb-2 block">
				<Label htmlFor="passwordCheck" value="Verification du mot de passe" />
			</div>
			<TextInput
				type="password"
				placeholder="Retapez le mot de passe"
				value={passwordCheck}
				color={passwordCheck.length === 0 || (passwordRegex.test(passwordCheck) && state[propertyUserName].password === passwordCheck) ? 'gray' : 'failure'}
				onChange={(e) => setPasswordCheck(e.target.value)}
				className="mb-4"
			/>
			{displayButton &&
				<div className="w-full flex flex-row justify-center">
					<Button type="submit" disabled={isLoading} className="btn-primary mb-4">
						{isLoading ? (
							<FontAwesomeIcon icon={faSpinner} spin />
						) : (
							'Créer un compte'
						)}
					</Button>
				</div>
			}
		</>
	);

	const content = (
		<>
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
		</>
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
				<>
					{content}
				</>
			}
		</div>
	);
}

export default SignUpForm;