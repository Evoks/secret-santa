import { useContext, useState } from 'react';
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

type LoginFormProps = {
	state?: any;
	includeForm?: boolean,
	includeCard?: boolean,
	includeTitle?: boolean,
	dispatchState?: any;
	displayButton: boolean;
	propertyUserName?: string;
	handleSubmitCallback?: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ state, dispatchState, displayButton, handleSubmitCallback, propertyUserName = 'user', includeTitle = false, includeCard = false, includeForm = true }: any) => {
	const { setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const setStateValue = (value: string, property: string) => {
		dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { [property]: value } });
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			let success = true;
			setIsLoading(true);
			try {
				const userLoggedInData = await AuthService.logIn(state[propertyUserName].email, state[propertyUserName].password);
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
		<>
			<div className="mb-2 block">
				<Label htmlFor="email" value="Adresse email" />
			</div>
			<TextInput
				type="email"
				placeholder="Renseignez votre adresse email"
				value={state[propertyUserName].email}
				color={state[propertyUserName].email.length === 0 || emailRegex.test(state[propertyUserName].email) ? 'gray' : 'failure'}
				onChange={(e) => dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { email: e.target.value } })}
				className="mb-2"
			/>
			<div className="mb-2 block">
				<Label htmlFor="password" value="Mot de passe" />
			</div>
			<InputPassword value={state[propertyUserName].password} setValue={setStateValue} property={propertyUserName} />
			{
				displayButton &&
				<div className="w-full flex flex-row justify-center">
					<Button type="submit" disabled={isLoading} className="btn-primary mb-4">
						{isLoading ? (
							<FontAwesomeIcon icon={faSpinner} spin />
						) : (
							'Connexion'
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
				<>
					{content}
				</>
			}
		</div>
	);
}

export default LoginForm;