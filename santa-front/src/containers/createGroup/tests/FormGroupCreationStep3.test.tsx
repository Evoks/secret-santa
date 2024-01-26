/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import FormGroupCreationStep3 from '../FormGroupCreationStep3';
import { FormGroupCreationContext } from '../FormGroupCreation.context';
import { useReducer } from 'react';
import { formGroupCreationReducer, initialState as defaultState } from '../FormGroupCreation.state';
import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('FormGroupCreationStep3', () => {
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

	it('should render the component', () => {
		const stateWithSomeData = {
			...defaultState,
			users: [
				{ name: 'John', excludedUsers: [] },
				{ name: 'Jane', excludedUsers: [] },
				{ name: 'Toto', excludedUsers: [] },
				{ name: 'Tata', excludedUsers: [] }
			]
		};

		render(
			<TestContextWrapper initialState={stateWithSomeData}>
				<FormGroupCreationStep3 />
			</TestContextWrapper>
		);

		const btnDisableExclusions = screen.getByTestId('btn-disable-exclusions');
		const btnEnableExclusions = screen.getByTestId('btn-enable-exclusions');
		expect(btnDisableExclusions).toBeInTheDocument();
		expect(btnEnableExclusions).toBeInTheDocument();
	});

	it('should display the exclusions inputs when we click on the btnEnableExclusions button', () => {
		const users = [
			{ name: 'John', excludedUsers: [] },
			{ name: 'Jane', excludedUsers: [] },
			{ name: 'Toto', excludedUsers: [] },
			{ name: 'Tata', excludedUsers: [] }
		];
		const stateWithSomeData = {
			...defaultState,
			users,
		};

		render(
			<TestContextWrapper initialState={stateWithSomeData}>
				<FormGroupCreationStep3 />
			</TestContextWrapper>
		);

		const btnEnableExclusions = screen.getByTestId('btn-enable-exclusions');
		fireEvent.click(btnEnableExclusions);
		users.map((_user, idx) => {
			expect(screen.getByTestId(`exclusion-user-${idx}`)).toBeInTheDocument();
		});
	});

	it('should display the exclusions modal when we click on the input one user', () => {
		const users = [
			{ name: 'John', excludedUsers: [] },
			{ name: 'Jane', excludedUsers: [] },
			{ name: 'Toto', excludedUsers: [] },
			{ name: 'Tata', excludedUsers: [] }
		];
		const stateWithSomeData = {
			...defaultState,
			users,
		};

		render(
			<TestContextWrapper initialState={stateWithSomeData}>
				<FormGroupCreationStep3 />
			</TestContextWrapper>
		);

		const btnEnableExclusions = screen.getByTestId('btn-enable-exclusions');
		fireEvent.click(btnEnableExclusions);
		const inputGroupUserExclusion = screen.getByTestId('exclusion-user-input-3');
		fireEvent.click(inputGroupUserExclusion);
		expect(screen.getByTestId('exclusion-modal')).toBeInTheDocument();
	});

	it('should display other users than the selected user in the exclusion list in modal, we can toggle each user, and the input has all user listed as value', async () => {
		const users = [
			{ name: 'John', excludedUsers: [] },
			{ name: 'Jane', excludedUsers: [] },
			{ name: 'Toto', excludedUsers: [] },
			{ name: 'Tata', excludedUsers: [] }
		];
		const stateWithSomeData = {
			...defaultState,
			users,
		};

		render(
			<TestContextWrapper initialState={stateWithSomeData}>
				<FormGroupCreationStep3 />
			</TestContextWrapper>
		);

		const btnEnableExclusions = screen.getByTestId('btn-enable-exclusions');
		fireEvent.click(btnEnableExclusions);
		const inputGroupUserExclusion = screen.getByTestId(`exclusion-user-input-0`) as HTMLInputElement;
		fireEvent.click(inputGroupUserExclusion);
		// we toggle only users with odd index to have true and false values
		users.filter((_user, idx) => {
			return idx % 2 === 0;
		}).map(async (_user, idx) => {
			const toggleUser = screen.getByTestId(`exclusion-toggle-${idx}`);
			fireEvent.click(toggleUser);
			const checkBoxUser = screen.getByTestId(`exclusion-checkbox-${idx}`) as HTMLInputElement;
			expect(checkBoxUser.checked).toBe(true);
			expect(toggleUser).toBeInTheDocument();
		});
		const modalSubmitBtn = screen.getByTestId('modal-submit-btn');
		fireEvent.click(modalSubmitBtn);
		expect(screen.queryByTestId('exclusion-modal')).not.toBeInTheDocument();
		expect(inputGroupUserExclusion.value).toBe('Jane, Toto');
	});
});
