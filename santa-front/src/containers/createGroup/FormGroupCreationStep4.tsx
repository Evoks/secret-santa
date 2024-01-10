import LoginSignUpForm from '../../components/LoginSignUpForm';

type FormGroupCreationStep4Props = {
	state: any;
	dispatchState: any;
}

const FormGroupCreationStep4: React.FC<FormGroupCreationStep4Props> = ({ state, dispatchState }: any) => {
	return (
		<>
			<LoginSignUpForm includeForm={false} includeTitle={false} displayButton={false} propertyUserName={'mainUser'} state={state} dispatchState={dispatchState} />
		</>
	);
}

export default FormGroupCreationStep4;
