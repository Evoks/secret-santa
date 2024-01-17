import { useContext } from 'react';
import LoginSignUpForm from '../../components/LoginSignUpForm';
import { FormGroupCreationContext } from './FormGroupCreation.context';

const FormGroupCreationStep4: React.FC = () => {
	const { state, dispatchState } = useContext(FormGroupCreationContext);

	return (
		<>
			<LoginSignUpForm includeForm={false} includeTitle={false} displayButton={false} propertyUserName={'mainUser'} state={state} dispatchState={dispatchState} />
		</>
	);
}

export default FormGroupCreationStep4;
