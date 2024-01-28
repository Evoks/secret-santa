import { useContext } from 'react';
import LoginSignUpForm from '../../components/LoginSignUpForm';
import { FormGroupCreationContext } from './FormGroupCreation.context';
import React from 'react';

const FormGroupCreationStep4: React.FC = () => {
	const { state, dispatchState } = useContext(FormGroupCreationContext);

	return (
		<React.Fragment>
			<LoginSignUpForm includeForm={false} includeTitle={false} displayButton={false} state={state} dispatchState={dispatchState} />
		</React.Fragment>
	);
}

export default FormGroupCreationStep4;
