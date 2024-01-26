// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import { useContext, useEffect } from 'react';
import User from '../../types/User';
import FormActionTypes from '../../types/FormGroupEditionActions.enum';
import UserEditableInput from '../../components/UserEditableInput';
import { FormGroupCreationContext } from './FormGroupCreation.context';

interface FormGroupCreationStep2Props {
	setCurrentStepValidityErrors: any;
}

const FormGroupCreationStep2: React.FC<FormGroupCreationStep2Props> = ({ setCurrentStepValidityErrors }: FormGroupCreationStep2Props) => {
	const { state, dispatchState } = useContext(FormGroupCreationContext);

	// Function to handle adding a user to the list
	const addUser = () => {
		dispatchState({ type: FormActionTypes.ADD_USER, payload: { name: '', excludedUsers: [] } });
	};

	useEffect(() => {
		const conds = [
			{
				message: 'Vous devez au moins avoir 4 participants dans votre groupe',
				test: state.users.length >= 4
			},
			{
				message: 'Vous devez avoir un nombre de participants paire',
				test: state.users.length % 2 === 0
			},
			{
				message: 'Chaque utilisateur doit avoir un nom',
				test: (state.users as User[]).filter((user: User) => !user.name || user.name.length === 0).length === 0
			},
			{
				message: 'Chaque nom de participant doit être unique',
				test: (state.users as User[]).filter((user: User, idx: number) => state.users?.findIndex((u: User) => u.name === user.name) === idx).length === state.users.length
			}
		];
		setCurrentStepValidityErrors(conds.filter(cond => cond.test === false).map(cond => cond.message));
	}, [setCurrentStepValidityErrors, state.users]);

	return (
		<div>
			<h2 className="mb-2 leading-7 font-bold text-black">Avec qui voulez-vous tirer au sort?</h2>
			<div className="mx-auto w-full">
				{state.users.map((user: User, idx: number) => {
					return (
						<div data-testid={`user-${idx}`} key={`user-${idx}`}>
							<UserEditableInput dispatchState={dispatchState} removable={idx > 0} disabled={idx === 0} inputName={'name'} value={user.name} idx={idx} />
						</div>
					);
				})}
			</div>
			<div className="mx-auto w-full">
				<button aria-label="Ajouter un participant" type="button" onClick={() => { addUser() }} className="btn btn-secondary mb-2 w-full">Ajouter un participant</button>
			</div>
		</div>
	);
}

export default FormGroupCreationStep2;
