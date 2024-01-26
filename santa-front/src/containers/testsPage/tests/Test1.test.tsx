/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Test1 from '../Test1';
import { act } from 'react-dom/test-utils';

describe('Test1', () => {
	it('renders the component', () => {
		render(<Test1 />);
		expect(screen.getByText('Ajouter')).toBeInTheDocument();
		expect(screen.getByText('0')).toBeInTheDocument();
		expect(screen.getByText('Enlever')).toBeInTheDocument();
	});

	it('increments the value when add button is clicked and decrements the value when remove button is clicked', () => {
		render(<Test1 />);
		act(() => {
			fireEvent.click(screen.getByText('Ajouter'));
		});
		expect(screen.getByText('1')).toBeInTheDocument();
		act(() => {
			fireEvent.click(screen.getByText('Enlever'));
		});
		expect(screen.getByText('0')).toBeInTheDocument();
	});
});
