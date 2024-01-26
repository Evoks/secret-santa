/**
 * @vitest-environment jsdom
 */
import { render, fireEvent, screen } from '@testing-library/react';
import FormGroupCreationStep1 from '../FormGroupCreationStep1';
import FormActionTypes from '../../../types/FormGroupEditionActions.enum';
import { formGroupCreationReducer, initialState as defaultState } from '../FormGroupCreation.state';
import { useReducer } from 'react';
import { FormGroupCreationContext } from '../FormGroupCreation.context';
import FormGroupCreationActions from '../../../types/FormGroupCreationActions.enum';
import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('FormGroupCreationStep1', () => {
	const mockDispatchState = vi.fn();
	const mockSetCurrentStepValidityErrors = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
	});

	const TestContextWrapper = ({ children, initialState, mockDispatchState = null }: any) => {
		const [state, dispatchState] = useReducer(formGroupCreationReducer, initialState);

		return (
			<FormGroupCreationContext.Provider value={{ state, dispatchState: mockDispatchState ? mockDispatchState : dispatchState }}>
				{children}
			</FormGroupCreationContext.Provider>
		);
	};

	it('renders inputs correctly', async () => {
		render(
			<TestContextWrapper initialState={defaultState}>
				<FormGroupCreationStep1
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(screen.getByPlaceholderText('Nom du groupe')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Quel est votre nom ?')).toBeInTheDocument();
		expect(screen.getByText('Date du tirage')).toBeInTheDocument();
		expect(await screen.findByTestId('date-picker')).toBeInTheDocument();
	});

	it('calls dispatch with the correct action on group name input change', () => {
		render(
			<TestContextWrapper initialState={defaultState} mockDispatchState={mockDispatchState}>
				<FormGroupCreationStep1
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
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
			<TestContextWrapper initialState={defaultState} mockDispatchState={mockDispatchState}>
				<FormGroupCreationStep1
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		const mainUserNameInput = screen.getByPlaceholderText('Quel est votre nom ?');
		fireEvent.change(mainUserNameInput, { target: { value: 'John Doe' } });

		expect(mockDispatchState).toHaveBeenCalledWith({
			type: FormGroupCreationActions.UPDATE_USER,
			payload: { name: 'John Doe', index: 0 },
		});
	});

	it('sets validity errors correctly when conditions are not met', () => {
		const stateWithInvalidData = {
			...defaultState,
			groupName: 'A', // less than 3 characters
			mainUser: { name: 'JD' }, // less than 3 characters
			dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // past date
		};
		// Rerender with invalid data to trigger useEffect
		render(
			<TestContextWrapper initialState={stateWithInvalidData}>
				<FormGroupCreationStep1
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Le nom du groupe doit au moins avoir 3 caractères',
			'Votre nom doit au moins avoir 3 caractères',
			'La date de tirage doit être dans le futur',
		]);
	});
});

