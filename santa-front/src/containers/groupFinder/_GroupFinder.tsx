import { Button, TextInput, Label, Select, Card } from "flowbite-react";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import User from "../../types/User";
import SignUpForm from "../../components/SignupForm";
import LoginForm from "../../components/LoginForm";
import AuthActions from "../../types/AuthActions.enum";
import AuthService from "../../services/auth.service";

const groupIdRegex = /^[a-f0-9]{24}$/;

type FormGroupFinderState = {
	groupName: string;
	dueDate: Date;
	user: User,
	users: User[];
	stepIdx: number;
	createAccount: boolean;
}

const initialState: FormGroupFinderState = {
	groupName: 'Test',
	dueDate: new Date(),
	user: { _id: null, name: '', password: '', email: '', excludedUsers: [] },
	users: [
		{ _id: null, name: 'Jean', excludedUsers: [] },
		{ _id: null, name: 'Marcel', excludedUsers: [] },
		{ _id: null, name: 'Antoinio', excludedUsers: [] }
	],
	stepIdx: 0,
	createAccount: false,
};

function formGroupCreationReducer(state: FormGroupFinderState, action: { type: string, payload: any }) {
	switch (action.type) {
		case AuthActions.UPDATE_MAIN_USER:
			return { ...state, user: { ...state.user, ...action.payload } };
		default:
			return state;
	}
}


const GroupFinder: React.FC<{}> = () => {
	const navigate = useNavigate();
	const { authUser, setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [groupId, setGroupId] = useState('65966e4393228568e618e0dd');
	const [isIdValid, setIsIdValid] = useState(true);
	const [groupExists, setGroupExists] = useState(false);
	const [groupUsers, setGroupUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [authFormType, setAuthFormType] = useState<'login' | 'signup' | null>(null);
	const [authState, dispatchAuthState] = useReducer(formGroupCreationReducer, initialState);

	useEffect(() => {
		if (authUser) {
			console.log('here', authUser);
			setSelectedUser(authUser);
		}
	}, [authUser]);


	const checkGroupValidity = async (groupId: string) => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/group/check/${groupId}`);
		if (!response.ok) {
			console.error('Group not found');
			return;
		}
		const data = await response.json();
		setGroupExists(data.success);
		setGroupUsers(data.users);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const isValid = groupIdRegex.test(value);
		setGroupId(value);
		setIsIdValid(isValid);
		if (isValid) {
			checkGroupValidity(value);
		} else {
			setGroupExists(false);
			setGroupUsers([]);
		}
	};

	const handleSelectGroupUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const userId = e.target.value;
		const user = groupUsers.find((user: User) => user._id === userId);
		if (user) {
			setSelectedUser(user);
		} else {
			setSelectedUser(null);
		}
		console.log({ user })
		if (user?.registered) {
			setAuthFormType('login');
		} else if (!authUser) {
			setAuthFormType('signup');
		} else {
			setAuthFormType(null);
		}
	}

	async function handleAuthentication() {
		try {
			let userLoggedInData;

			if (authFormType === 'signup') {
				userLoggedInData = await AuthService.signUp(authState.user.name, authState.user.email, authState.user.password);
			} else if (authFormType === 'login') {
				userLoggedInData = await AuthService.logIn(authState.user.email, authState.user.password);
			}

			if (userLoggedInData?.success) {
				setAuthUser(userLoggedInData.user);
				return true;
			}
		} catch (error) {
			console.error("Authentication error:", error);
		}
		return false;
	}

	const actionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			// login or create account for main user mangement
			if (!authUser) {
				const userLoggedIn = await handleAuthentication();

				if (!userLoggedIn) {
					addToast({ message: 'Une erreur est survenue lors de la connexion', type: 'error' });
					throw new Error('Authentication error');
				}
			}

			if (!selectedUser) {
				console.error('No user selected');
				return;
			}
			if (!isIdValid) {
				console.error('Group ID is not valid');
				return;
			}
			const form = e.target as HTMLFormElement;
			const groupId = form.groupId.value;

			navigate(`/group/${groupId}`);
		} catch (err) {
			console.error('Group creation error:', err);
		};
	}

	return (
		<Card className="bg-frosty">
			<form onSubmit={actionHandler} className="flex flex-col w-full justify-center mx-auto">
				<div className="mb-4">
					<div className="mb-2 block">
						<Label htmlFor="groupId" value="Identifiant du groupe" />
					</div>
					<div className="mb-2">
						<TextInput placeholder="ex: 6581605d394a6586d9a124bc" color={isIdValid ? 'valid' : 'gray'} value={groupId} onChange={handleInputChange} name="groupId" />
					</div>
				</div>
				{groupExists &&
					<>
						<div className="mb-2 block">
							<Label htmlFor="groupUsers" value="Quel membre du groupe êtes-vous ?" />
						</div>
						<Select id="groupUsers" disabled={!!authUser} required className="mb-4" defaultValue={authUser ? authUser._id as string : ''} onChange={handleSelectGroupUserChange}>
							<option value="">Choisissez un utilisateur</option>
							{groupUsers.map((user: User) => (
								<option value={user._id as string} key={user._id}>{user.name}</option>
							))}
						</Select>
						{authFormType === 'signup' &&
							<>
								<div className="mb-2 block text-center w-full font-bold">
									Inscription
								</div>
								<SignUpForm dispInputName={false} includeForm={false} state={authState} dispatchState={dispatchAuthState} includeTitle={false} displayButton={false} />
							</>
						}
						{authFormType === 'login' &&
							<>
								<div className="mb-2 block text-center w-full font-bold">
									Connexion au compte
								</div>
								<LoginForm includeForm={false} state={authState} dispatchState={dispatchAuthState} includeTitle={false} displayButton={false} />
							</>
						}
					</>
				}
				<div className="w-full lg:w-1/2 mx-auto">
					<Button type="submit" className="btn-primary mx-auto btn" disabled={!isIdValid || !selectedUser}>Accéder au groupe</Button>
				</div>
			</form>
		</Card>
	)
}

export default GroupFinder;
