import { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'flowbite-react';
import User from '../../types/User';
import FormGroupCreationActions from '../../types/FormGroupCreationActions.enum';
import FormGroupCreationStep1 from './FormGroupCreationStep1';
import FormGroupCreationStep2 from './FormGroupCreationStep2';
import FormGroupCreationStep3 from './FormGroupCreationStep3';
import FormGroupCreationStep4 from './FormGroupCreationStep4';
import FormErrors from '../../components/FormErrors';
import Title from '../../components/Title';
import StepIndicator from '../../components/StepIndicator';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastContext } from '../../contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AuthActions from '../../types/AuthActions.enum';
import AuthService from '../../services/auth.service';
import { formGroupCreationReducer, initialState } from './FormGroupCreation.state';
import { useQueryClient } from '@tanstack/react-query';
import { FormGroupCreationContext } from './FormGroupCreation.context';
import React from 'react';

const FormGroupCreation: React.FC = () => {
	const navigation = useNavigate();
	const queryClient = useQueryClient();
	const { authUser, setAuthUser } = useContext(AuthContext);
	const { addToast } = useContext(ToastContext);

	const [currentStepValidityErrors, setCurrentStepValidityErrors] = useState<string[]>([]);

	// Store the list of users in state
	const [state, dispatchState] = useReducer(formGroupCreationReducer, initialState);

	// Define the steps array
	const steps = useMemo(() => {
		if (authUser) {
			return [1, 2, 3];
		} else {
			return [1, 2, 3, 4];
		}
	}, [authUser]);

	// Effect for updating the main user when the authUser changes
	useEffect(() => {
		if (authUser) {
			dispatchState({ type: AuthActions.UPDATE_USER_ID, payload: authUser._id });
			dispatchState({ type: FormGroupCreationActions.UPDATE_USER, payload: { index: 0, ...authUser } });
		}
	}, [authUser]);

	// Memo for step descriptions
	const stepDescriptions = useMemo(() => {
		return [
			'Information du groupe',
			'Ajoutez des participants',
			'Gérez les exclusions',
			'Connectez-vous ou créez un compte'
		];
	}, []);

	// Effect for adding a user when the step changes to 2 and there's only one user
	useEffect(() => {
		if (steps[state.stepIdx] === 2 && state.users.length === 0) {
			dispatchState({ type: FormGroupCreationActions.ADD_USER, payload: { name: '', excludedUsers: [] } });
		}
	}, [steps, state.users.length, state.stepIdx]);

	const changeStepIdxHandler = (stepIdx: number) => {
		if (!!steps[stepIdx]) {
			dispatchState({ type: FormGroupCreationActions.UPDATE_STEP, payload: { stepIdx } });
		}
	}

	async function authenticationHandler() {
		try {
			let userLoggedInData;
			const mainUser = state.users[0];
			if (mainUser) {
				if (!mainUser.email || !mainUser.password) {
					addToast({ message: 'Vous devez renseigner une adresse email et un mot de passe', type: 'error' });
					return false;
				}
				if (state.createAccount) {
					userLoggedInData = await AuthService.signUp(mainUser.name, mainUser.email, mainUser.password);
				} else {
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

	// Function to handle form submission for group creation
	const actionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// check if we are on the last step
		if (steps[state.stepIdx] === steps[steps.length - 1]) {
			try {
				// login or create account for main user mangement
				if (!authUser) {
					const userLoggedIn = await authenticationHandler();

					if (!userLoggedIn) {
						addToast({ message: 'Une erreur est survenue lors de la connexion', type: 'error' });
						throw new Error('Authentication error');
					}
				}

				// create users to get _id for each
				const userCreationPromises = state.users.map(async (user: User) => {
					if (!user._id) {
						const resCreateUser = await fetch(`${import.meta.env.VITE_APP_API_URL}/user`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								...user
							})
						});

						const resCreateUserJSON = await resCreateUser.json();

						if (resCreateUserJSON.success) {
							return resCreateUserJSON.data;
						}
						throw new Error('User creation error');
					}

					return user;
				});

				const usersIds: { _id: string }[] = await Promise.all(userCreationPromises);
				// we have to assign _id for each user using the data we got from the server
				const usersData: User[] = state.users.map((user: User, index: number) => {
					const usersId = usersIds[index];
					return { ...user, _id: usersId._id };
				});

				if (usersIds.length !== state.users.length) {
					addToast({ message: 'Une erreur est survenue lors de la création des utilisateurs', type: 'error' });
					throw new Error('User creation error');
				}

				// update mainUserId in state with main user data
				dispatchState({
					type: AuthActions.UPDATE_USER_ID, payload: {
						user: usersData[0]._id
					}
				});
				// update users object in state with users data
				dispatchState({
					type: FormGroupCreationActions.UPDATE_USERS, payload: {
						// remove main user from users list
						users: usersData
					}
				});

				// create group 
				const body = {
					name: state.groupName,
					mainUser: usersIds[0]._id,
					users: usersData,
					dueDate: state.dueDate.getTime(),
					exclusions: usersData.map((user: User) => { return { userId: user._id, excludedUsers: user.excludedUsers } })
				};
				const resCreateGroup = await fetch(`${import.meta.env.VITE_APP_API_URL}/group`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				});
				const createGroupData = await resCreateGroup.json();

				if (createGroupData.success) {
					// we invalidate the groups query to refresh the list next time we go to the groups page
					queryClient.invalidateQueries({ queryKey: ['groups'] });
					// Redirect to the group page
					navigation(`/group/${createGroupData.data._id}`);
				} else {
					addToast({ message: createGroupData.message, type: 'error' });
				}
			} catch (err) {
				addToast({ message: 'Erreur lors de la création du groupe', type: 'error' });
				console.error('Group creation error:', err);
			};
		} else {
			changeStepIdxHandler(state.stepIdx + 1);
		}
	}

	return (
		<React.Fragment>
			<Title title={"Générateur de Secret Santa"} subtitle={"Faites rapidement un tirage au sort par email ou WhatsApp."} />
			<Card className="bg-frosty">
				<FormGroupCreationContext.Provider value={{ state, dispatchState }}>
					<form onSubmit={actionHandler} className="w-full max-w-[720px] mx-auto">
						<StepIndicator steps={steps} currentStep={state.stepIdx} text={`Étape ${steps[state.stepIdx]} ${state.groupName}`} />
						<div className="mb-8">
							<h2 className="leading-7 font-bold text-center text-2xl text-gradient-blue-purple">
								{
									stepDescriptions[state.stepIdx] && ` ${stepDescriptions[state.stepIdx]}`
								}
							</h2>
						</div>
						<div className="flex flex-col mx-auto relative">
							{/* STEP 1 - Set name and creator name */}
							{steps[state.stepIdx] === 1 &&
								<FormGroupCreationStep1 setCurrentStepValidityErrors={setCurrentStepValidityErrors} />
							}
							{/* STEP 2  - Add users to the group */}
							{steps[state.stepIdx] === 2 &&
								<FormGroupCreationStep2 setCurrentStepValidityErrors={setCurrentStepValidityErrors} />
							}
							{/* STEP 3 - Exclusions management */}
							{steps[state.stepIdx] === 3 &&
								<FormGroupCreationStep3 />
							}
							{/* STEP 4 - Main user authentication */}
							{!authUser && steps[state.stepIdx] === 4 &&
								<FormGroupCreationStep4 />
							}
							{/* actions buttons */}
							<div className="flex flex-row w-full mt-8">
								{/* go prev btn */}
								{steps[state.stepIdx] > 1 &&
									<div onClick={() => { changeStepIdxHandler(state.stepIdx - 1) }} className="w-1/6 btn btn-primary mb-2 mr-2">
										<FontAwesomeIcon icon={faArrowLeft} />
									</div>
								}
								{/* go next btn */}
								<button aria-label={steps[state.stepIdx] < steps.length ? 'Continuer' : 'Créer le groupe'} disabled={currentStepValidityErrors.length > 0} className="w-5/6 btn btn-primary mb-2 flex-1">
									{steps[state.stepIdx] < steps.length ? 'Continuer' : 'Créer le groupe'}
								</button>
							</div>
							{currentStepValidityErrors.length > 0 &&
								<FormErrors errors={currentStepValidityErrors} />
							}
						</div>
					</form>
				</FormGroupCreationContext.Provider>
			</Card>
		</React.Fragment>
	);
}

export default FormGroupCreation;
