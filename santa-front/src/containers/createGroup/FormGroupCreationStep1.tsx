import FormActionTypes from '../../types/FormGroupEditionActions.enum';
import { Datepicker, TextInput } from 'flowbite-react';
import AuthActions from '../../types/AuthActions.enum';
import { useContext, useEffect } from 'react';
import { FormGroupCreationContext } from './FormGroupCreation.context';

type FormGroupCreationStep1Props = {
	setCurrentStepValidityErrors: any;
}

const FormGroupCreationStep1: React.FC<FormGroupCreationStep1Props> = ({ setCurrentStepValidityErrors }: FormGroupCreationStep1Props) => {
	const { state, dispatchState } = useContext(FormGroupCreationContext);
	
	const handleGroupNameInputChange = (value: string) => {
		dispatchState({ type: FormActionTypes.UPDATE_GROUP_NAME, payload: { name: value } });
	};

	const handleDueDateInputChange = (date: Date) => {
		dispatchState({ type: FormActionTypes.UPDATE_DUE_DATE, payload: { dueDate: date } });
	}

	useEffect(() => {
		const conds = [
			{
				message: 'Le nom du groupe doit au moins avoir 3 caractères',
				test: state.groupName.length >= 3
			},
			{
				message: 'Votre nom doit au moins avoir 3 caractères',
				test: state.mainUser?.name?.length >= 3
			},
			{
				message: 'La date de tirage doit être dans le futur',
				test: state.dueDate > new Date().setHours(0, 0, -1) // current day
			},
		];
		setCurrentStepValidityErrors(conds.filter(cond => cond.test === false).map(cond => cond.message));
	}, [setCurrentStepValidityErrors, state.dueDate, state.groupName, state.mainUser]);

	return (
		<>
			<div className="mb-2">
				<div className="mb-2">
					<h2 className="leading-7 font-bold text-black">Nom du groupe</h2>
					<TextInput placeholder='Nom du groupe' disabled={false} value={state.groupName} onChange={(e) => { handleGroupNameInputChange(e.target.value) }} />
				</div>
				<div className="mb-2">
					<h2 className="leading-7 font-bold text-black">Quel est votre nom ?</h2>
					<TextInput placeholder='Quel est votre nom ?' disabled={false} value={state.mainUser?.name} onChange={(e) => { dispatchState({ type: AuthActions.UPDATE_MAIN_USER, payload: { name: e.target.value } }) }} />
				</div>
				<div className="mb-2">
					<h2 className="leading-7 font-bold text-black">Date du tirage</h2>
					<Datepicker
						data-testid="date-picker"
						language="fr-FR"
						minDate={new Date()}
						weekStart={1}
						title="Choisissez la date de tirage"
						onSelectedDateChanged={(date: Date) => handleDueDateInputChange(date)}
					/>
				</div>
			</div>
		</>
	);
}

export default FormGroupCreationStep1;
