// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import { useEffect } from 'react';
import User from '../../types/User';
import FormActionTypes from '../../types/FormGroupEditionActions.enum';
import UserEditableInput from '../../components/UserEditableInput';

interface FormGroupCreationStep2Props {
	state: any;
	dispatchState: any;
	setCurrentStepValidityErrors: any;
}

const FormGroupCreationStep2: React.FC<FormGroupCreationStep2Props> = ({ state, dispatchState, setCurrentStepValidityErrors }: FormGroupCreationStep2Props) => {
	// Function to handle adding a user to the list
	const addUser = () => {
		dispatchState({ type: FormActionTypes.ADD_USER, payload: { name: '', excludedUsers: [] } });
	};

	useEffect(() => {
		const users = [state.mainUser, ...state.users];

		const conds = [
			{
				message: 'Vous devez au moins avoir 4 participants dans votre groupe',
				test: users.length >= 4
			},
			{
				message: 'Vous devez avoir un nombre de participants paire',
				test: users.length % 2 === 0
			},
			{
				message: 'Chaque utilisateur doit avoir un nom',
				test: (users as User[]).filter((user: User) => !user.name || user.name.length === 0).length === 0
			},
			{
				message: 'Chaque nom de participant doit être unique',
				test: (users as User[]).filter((user: User, idx: number) => users?.findIndex((u: User) => u.name === user.name) === idx).length === users.length
			}
		];
		setCurrentStepValidityErrors(conds.filter(cond => cond.test === false).map(cond => cond.message));
	}, [setCurrentStepValidityErrors, state.mainUser, state.users]);


	return (
		<>
			<div>
				<h2 className="mb-2 leading-7 font-bold text-black">Avec qui voulez-vous tirer au sort?</h2>
				<div className="mx-auto w-full">
					<UserEditableInput dispatchState={dispatchState} removable={false} disabled={true} inputName={'name'} value={state.mainUser.name} idx={-1} />
					{state.users.map((user: User, idx: number) => {
						return (
							<div key={idx}>
								<UserEditableInput dispatchState={dispatchState} removable={true} disabled={false} inputName={'name'} value={user.name} idx={idx} />
							</div>
						);
					})}
				</div>
				<div className="mx-auto w-full">
					<button type="button" onClick={() => { addUser() }} className="btn btn-secondary mb-2 w-full">Ajouter un participant</button>
				</div>
			</div>
		</>
	);
}

export default FormGroupCreationStep2;
