import React from 'react';
import { render, screen } from '@testing-library/react';
import FormGroupCreation from '../src/components/createGroup/FormGroupCreation';
import userEvent from '@testing-library/user-event';

describe('FormGroupCreation', () => {
	test('renders with initial state', () => {
		render(<FormGroupCreation />);
		expect(screen.getByText(/Nom du groupe/i)).toBeInTheDocument();
		expect(screen.getByText(/Michel/i)).toBeInTheDocument(); // Assuming Michel is a default user
		// ... other initial state checks
	});

	test('adds a user when add user button is clicked', () => {
		render(<FormGroupCreation />);
		userEvent.click(screen.getByText(/Ajouter un participant/i));
		expect(screen.getAllByText(/Nom du participant/i).length).toBe(5); // Assuming there were initially 4 users
	});

	test('updates group name', () => {
		render(<FormGroupCreation />);
		const input = screen.getByLabelText(/Nom du groupe/i);
		userEvent.type(input, 'New Group Name');
		expect(screen.getByDisplayValue(/New Group Name/i)).toBeInTheDocument();
	});

	test('submits form with correct data', () => {
		render(<FormGroupCreation />);
		// Fill out the form fields
		userEvent.type(screen.getByLabelText(/Nom du groupe/i), 'My Group');
		userEvent.click(screen.getByText(/Créer le groupe/i));
		// Here you can mock fetch or the submission function to test the submission logic
	});
});
