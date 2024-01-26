/**
 * @vitest-environment jsdom
 */
import { render, fireEvent, screen } from '@testing-library/react';
import FormGroupCreationStep2 from '../FormGroupCreationStep2';
import { FormGroupCreationContext } from '../FormGroupCreation.context';
import { useReducer } from 'react';
import { formGroupCreationReducer, initialState as defaultState } from '../FormGroupCreation.state';
import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('FormGroupCreationStep2', () => {
	const mockSetCurrentStepValidityErrors = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
	});

	const TestContextWrapper = ({ children, initialState }: any) => {
		const [state, dispatchState] = useReducer(formGroupCreationReducer, initialState);

		return (
			<FormGroupCreationContext.Provider value={{ state, dispatchState }}>
				{children}
			</FormGroupCreationContext.Provider>
		);
	};

	it('renders the initial main user input', () => {

		const stateWithSomeData = {
			...defaultState,
			users: [{ name: 'John', excludedUsers: [] }]
		};

		render(
			<TestContextWrapper initialState={stateWithSomeData}>
				<FormGroupCreationStep2
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(screen.getByDisplayValue('John')).toBeInTheDocument();
	});

	it('adds a new user when add user button is clicked', () => {
		render(
			<TestContextWrapper initialState={defaultState} >
				<FormGroupCreationStep2
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		fireEvent.click(screen.getByText('Ajouter un participant'));
		expect(screen.getByTestId('user-1')).toBeInTheDocument();
	});

	it('sets validity error correctly when there is only one user', () => {
		const stateWithInvalidData = {
			...defaultState,
			users: [
				{ name: 'John', excludedUsers: [] },
				{ name: 'Jane', excludedUsers: [] },
			] // Insufficient and invalid users
		};

		render(
			<TestContextWrapper initialState={stateWithInvalidData}>
				<FormGroupCreationStep2
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Vous devez au moins avoir 4 participants dans votre groupe',
		]);
	});

	it('sets validity error correctly when there is odd number of users', () => {
		const stateWithInvalidData = {
			...defaultState,
			users: [
				{ name: 'John', excludedUsers: [] },
				{ name: 'Jane', excludedUsers: [] },
				{ name: 'Tata', excludedUsers: [] },
				{ name: 'Tutu', excludedUsers: [] },
				{ name: 'Toto', excludedUsers: [] },
			]
		};

		render(
			<TestContextWrapper initialState={stateWithInvalidData}>
				<FormGroupCreationStep2
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Vous devez avoir un nombre de participants paire',
		]);
	});

	it('sets validity error correctly when there are errors with user names', () => {
		const stateWithInvalidData = {
			...defaultState,
			users: [
				{ name: 'Test', excludedUsers: [] },
				{ name: 'Test', excludedUsers: [] },
				{ name: '', excludedUsers: [] },
				{ name: '', excludedUsers: [] },
			]
		};

		render(
			<TestContextWrapper initialState={stateWithInvalidData}>
				<FormGroupCreationStep2
					setCurrentStepValidityErrors={mockSetCurrentStepValidityErrors}
				/>
			</TestContextWrapper>
		);

		expect(mockSetCurrentStepValidityErrors).toHaveBeenCalledWith([
			'Chaque utilisateur doit avoir un nom',
			'Chaque nom de participant doit être unique'
		]);
	});
});
