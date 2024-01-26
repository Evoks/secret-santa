import { Button, TextInput, Label, Select, Card } from "flowbite-react";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastContext } from "../../contexts/ToastContext";
import User from "../../types/User";
import SignUpForm from "../../components/SignupForm";
import LoginForm from "../../components/LoginForm";
import AuthService from "../../services/auth.service";
import { formGroupCreationReducer, initialState } from "./GroupFinder.state";
import React from "react";

const groupIdRegex = /^[a-f0-9]{24}$/;

type GroupFinderProps = {
	data: { groupId: string };
}

const GroupFinder: React.FC<GroupFinderProps> = ({ data }: GroupFinderProps) => {
	const navigate = useNavigate();
	const { authUser, setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [groupId, setGroupId] = useState(data.groupId);
	const [isIdValid, setIsIdValid] = useState(true);
	const [groupExists, setGroupExists] = useState(false);
	const [groupUsers, setGroupUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [authFormType, setAuthFormType] = useState<'login' | 'signup' | null>(null);
	const [state, dispatchState] = useReducer(formGroupCreationReducer, initialState);

	useEffect(() => {
		if (authUser) {
			setSelectedUser(authUser);
		}
	}, [authUser]);

	const checkGroupValidity = async (groupId: string) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/group/check/${groupId}`);
			if (!response.ok) {
				addToast({ message: 'Le groupe n\'existe pas', type: 'error' });
				return;
			}
			const data = await response.json();
			setGroupExists(data.success);
			setGroupUsers(data.users);
		} catch (e) {
			addToast({ message: 'Une erreur s\'est produite !', type: 'error' });
			console.error('Group not found');
		}
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
			state.mainUserId = user?._id;
			state.users[0] = { ...state.users[0], ...user };
			setSelectedUser(user);
		} else {
			setSelectedUser(null);
		}
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
			const mainUser = state.users[0];
			if (mainUser && mainUser.email && mainUser.password) {
				if (authFormType === 'signup') {
					userLoggedInData = await AuthService.signUp(mainUser.name, mainUser.email, mainUser.password, mainUser._id);
				} else if (authFormType === 'login') {
					userLoggedInData = await AuthService.logIn(mainUser.email, mainUser.password);
				}

				if (userLoggedInData?.success) {
					setAuthUser(userLoggedInData.user);
					return true;
				}
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

			if (groupExists) {
				navigate(`/group/${groupId}`);
			}
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
						<TextInput placeholder="ex: 6581605d394a6586d9a124bc" color={isIdValid ? 'success' : 'gray'} value={groupId} onChange={handleInputChange} name="groupId" />
					</div>
				</div>
				{groupExists &&
					<React.Fragment>
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
							<React.Fragment>
								<div className="mb-2 block text-center w-full font-bold text-dark">
									Inscription
								</div>
								<SignUpForm dispInputName={false} includeForm={false} state={state} dispatchState={dispatchState} includeTitle={false} displayButton={false} />
							</React.Fragment>
						}
						{authFormType === 'login' &&
							<React.Fragment>
								<div className="mb-2 block text-center w-full font-bold">
									Connexion au compte
								</div>
								<LoginForm includeForm={false} state={state} dispatchState={dispatchState} includeTitle={false} displayButton={false} />
							</React.Fragment>
						}
					</React.Fragment>
				}
				<div className="w-full lg:w-1/2 mx-auto">
					<Button aria-label="Accéder au groupe" type="submit" className="btn-primary mx-auto btn" disabled={!isIdValid || !selectedUser || !groupExists}>Accéder au groupe</Button>
				</div>
			</form>
		</Card>
	)
}

export default GroupFinder;
