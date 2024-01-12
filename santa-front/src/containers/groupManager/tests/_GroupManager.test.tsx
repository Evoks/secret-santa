import { render, screen } from '@testing-library/react';
import GroupManager from '../_GroupManager';
import { AuthContext } from '../../../contexts/AuthContext';
import User from '../../../types/User';
import Group from '../../../types/Group';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // import and spread all the actual exported values
	useNavigate: () => mockNavigate, // return the mock navigate function
}));

// Test data
// Mock group data
const mockGroup = {
	"_id": "6597cddd41c344c5a406b7be",
	"name": "Test",
	"mainUser": {
		"_id": "65966d7093228568e618e0c1",
		"name": "Michel",
		"email": "test@test.com",
		"registered": true
	} as User,
	"users": [
		{
			"_id": "65966d7093228568e618e0c1",
			"name": "Michel",
			"email": "test@test.com",
			"registered": true
		} as User,
		{
			"_id": "6597cddd41c344c5a406b7b8",
			"name": "Jean",
			"registered": false
		} as User,
		{
			"_id": "6597cddd41c344c5a406b7ba",
			"name": "Marcel",
			"registered": false
		},
		{
			"_id": "6597cddd41c344c5a406b7bc",
			"name": "Antoinio",
			"registered": false
		} as User
	] as User[],
	"exclusions": [],
	"associations": [
		{
			"userId": {
				"_id": "65966d7093228568e618e0c1",
				"name": "Michel",
				"email": "jbaptiste.meunier@gmail.com",
				"registered": true
			},
			"associatedUser": {
				"_id": "6597cddd41c344c5a406b7b8",
				"name": "Jean",
				"registered": false
			},
		},
		{
			"userId": {
				"_id": "6597cddd41c344c5a406b7b8",
				"name": "Jean",
				"email": "jean@test.com",
				"registered": true
			},
			"associatedUser": {
				"_id": "6597cddd41c344c5a406b7ba",
				"name": "Marcel",
				"registered": false
			},
		},
		{
			"userId": {
				"_id": "6597cddd41c344c5a406b7ba",
				"name": "Marcel",
				"registered": false
			},
			"associatedUser": {
				"_id": "6597cddd41c344c5a406b7bc",
				"name": "Antoinio",
				"registered": false
			},
		},
		{
			"userId": {
				"_id": "6597cddd41c344c5a406b7bc",
				"name": "Antoinio",
				"registered": false
			},
			"associatedUser": {
				"_id": "65966d7093228568e618e0c1",
				"name": "Michel",
				"email": "jbaptiste.meunier@gmail.com",
				"registered": true
			},
		}
	],
	"dueDate": new Date(new Date().setDate(new Date().getDate() + 7)),
} as any as Group;
const mockMainUserAuthUser = {
	"_id": "65966d7093228568e618e0c1",
	"name": "Michel",
	"email": "test@test.com",
	"registered": true
} as User; // Mock authenticated main user data
const mockUserAuthUser = {
	"_id": "6597cddd41c344c5a406b7b8",
	"name": "Jean",
	"email": "jean@test.com",
	"registered": true
} as User; // Mock authenticated user data

describe('GroupManager Component', () => {
	// Helper function to render the component with necessary context
	const renderComponent = (group: Group, authUser: User | null) => {
		const setAuthUser = jest.fn();
		return render(
			<AuthContext.Provider value={{ authUser, setAuthUser }}>
				<GroupManager group={group} />
			</AuthContext.Provider>
		);
	};

	it('With mockNonAuthUser, it should be redirected to /login', () => {
		renderComponent(mockGroup, null);
		expect(mockNavigate).toHaveBeenCalledWith('/login');
	});

	it('renders without crashing with mockMainUserAuthUser and inputs are editable', () => {
		renderComponent(mockGroup, mockMainUserAuthUser);
		expect(screen.getByText(/Nom du groupe/)).toBeInTheDocument();
		// test if the inputs are editable
		const inputGroupName = screen.getByTestId('groupName');
		expect(inputGroupName).toBeInTheDocument();
		expect(inputGroupName).toBeEnabled();
		
		const inputGroupDueDate = screen.getByTestId('dueDate');
		expect(inputGroupDueDate).toBeInTheDocument();
		expect(inputGroupDueDate).toBeEnabled();
	});


	it('renders without crashing with mockUserAuthUser and inputs are disabled', () => {
		renderComponent(mockGroup, mockUserAuthUser);
		expect(screen.getByText(/Nom du groupe/)).toBeInTheDocument();
		// test if the inputs are disabled
		const inputGroupName = screen.getByTestId('groupName');
		expect(inputGroupName).toBeInTheDocument();
		expect(inputGroupName).toBeDisabled();

		const inputGroupDueDate = screen.getByTestId('dueDate');
		expect(inputGroupDueDate).toBeInTheDocument();
		expect(inputGroupDueDate).toBeDisabled();
	});
});
