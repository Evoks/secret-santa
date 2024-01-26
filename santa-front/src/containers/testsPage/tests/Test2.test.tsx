
/**
 * @vitest-environment jsdom
 */
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Test2 from '../Test2';

describe('Test2', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders the component', () => {
		render(<Test2 />);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should display the error when there is an error', async () => {
		vi.stubGlobal('fetch', vi.fn(() =>
			Promise.resolve({
				json: () => Promise.reject(new Error('Cannot get json')), // Mocked response
			})
		));
		render(<Test2 />);
		await waitFor(() => screen.getByText('Erreur à la récuperation des données'));
		expect(screen.getByText('Erreur à la récuperation des données')).toBeInTheDocument();
	});
});