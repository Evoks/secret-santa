import { render, fireEvent, screen } from '@testing-library/react';
import FormGroupCreationStep1 from '../FormGroupCreationStep1'; // Adjust the import according to your file structure
import FormActionTypes from '../../../types/FormGroupEditionActions.enum';
import AuthActions from '../../../types/AuthActions.enum';

describe('FormGroupCreationStep1', () => {
	const mockDispatchState = jest.fn();
	const mockSetCurrentStepValidityErrors = jest.fn();

	beforeEach(() => {
		jest.resetAllMocks();
	});

	const initialState = {
		groupName: '',
		mainUser: { name: '' },
		dueDate: new Date(),
	};

	it('renders inputs correctly', async () => {
		render(
			<FormGroupCreationStep1
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(screen.getByPlaceholderText('Nom du groupe')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Quel est votre nom ?')).toBeInTheDocument();
		expect(screen.getByText('Date du tirage')).toBeInTheDocument();
		expect(await screen.findByTestId('date-picker')).toBeInTheDocument();
	});

	it('calls dispatch with the correct action on group name input change', () => {
		render(
			<FormGroupCreationStep1
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		const groupNameInput = screen.getByPlaceholderText('Nom du groupe');
		fireEvent.change(groupNameInput, { target: { value: 'New Group' } });

		expect(mockDispatchState).toHaveBeenCalledWith({
			type: FormActionTypes.UPDATE_GROUP_NAME,
			payload: { name: 'New Group' },
		});
	});

	it('calls dispatch with the correct action on main user name input change', () => {
		render(
			<FormGroupCreationStep1
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		const mainUserNameInput = screen.getByPlaceholderText('Quel est votre nom ?');
		fireEvent.change(mainUserNameInput, { target: { value: 'John Doe' } });

		expect(mockDispatchState).toHaveBeenCalledWith({
			type: AuthActions.UPDATE_MAIN_USER,
			payload: { name: 'John Doe' },
		});
	});

	it('sets validity errors correctly when conditions are not met', () => {
		const stateWithInvalidData = {
			...initialState,
			groupName: 'A', // less than 3 characters
			mainUser: { name: 'JD' }, // less than 3 characters
			dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // past date
		};

		const { rerender } = render(
			<FormGroupCreationStep1
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		// Rerender with invalid data to trigger useEffect
		rerender(
			<FormGroupCreationStep1
				state={stateWithInvalidData}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Le nom du groupe doit au moins avoir 3 caractères',
			'Votre nom doit au moins avoir 3 caractères',
			'La date de tirage doit être dans le futur',
		]);
	});
});

