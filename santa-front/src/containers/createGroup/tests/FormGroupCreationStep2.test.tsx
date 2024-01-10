import { render, fireEvent, screen } from '@testing-library/react';
import FormGroupCreationStep2 from '../FormGroupCreationStep2'; // Adjust the import according to your file structure
import FormActionTypes from '../../../types/FormGroupEditionActions.enum';

describe('FormGroupCreationStep2', () => {
	const mockDispatchState = jest.fn();
	const mockSetCurrentStepValidityErrors = jest.fn();

	beforeEach(() => {
		jest.resetAllMocks();
	});

	const initialState = {
		mainUser: { name: 'Main User', excludedUsers: [] },
		users: [],
	};

	it('renders the initial main user input', () => {
		render(
			<FormGroupCreationStep2
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(screen.getByDisplayValue('Main User')).toBeInTheDocument();
	});

	it('adds a new user when add user button is clicked', () => {
		render(
			<FormGroupCreationStep2
				state={initialState}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		fireEvent.click(screen.getByText('Ajouter un participant'));
		expect(mockDispatchState).toHaveBeenCalledWith({
			type: FormActionTypes.ADD_USER,
			payload: { name: '', excludedUsers: [] },
		});
	});

	it('sets validity error correctly when there is only one user', () => {
		const stateWithInvalidData = {
			...initialState,
			users: [{ name: 'John', excludedUsers: [] }] // Insufficient and invalid users
		};

		render(
			<FormGroupCreationStep2
				state={stateWithInvalidData}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Vous devez au moins avoir 4 participants dans votre groupe',
		]);
	});

	it('sets validity error correctly when there is odd number of users', () => {
		const stateWithInvalidData = {
			...initialState,
			users: [
				{ name: 'John', excludedUsers: [] },
				{ name: 'Jane', excludedUsers: [] },
				{ name: 'Toto', excludedUsers: [] },
				{ name: 'Doe', excludedUsers: [] },
			]
		};

		render(
			<FormGroupCreationStep2
				state={stateWithInvalidData}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Vous devez avoir un nombre de participants paire',
		]);
	});

	it('sets validity error correctly when there are errors with user names', () => {
		const stateWithInvalidData = {
			...initialState,
			users: [
				{ name: 'Test', excludedUsers: [] },
				{ name: 'Test', excludedUsers: [] },
				{ name: '', excludedUsers: [] },
				{ name: '', excludedUsers: [] },
				{ name: '', excludedUsers: [] },
			]
		};

		render(
			<FormGroupCreationStep2
				state={stateWithInvalidData}
				dispatchState={mockDispatchState}
				setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
			/>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Chaque utilisateur doit avoir un nom',
			'Chaque nom de participant doit être unique'
		]);
	});
});
