import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Body, ErrorPage } from './components/structure';
// pages
import { Error, Layout, HomePage, GroupManager, UserGroups, GroupFinder, LoginPage, Logout } from './pages/';
// loaders
import { loader as groupLoader } from './pages/GroupManagerPage';
import { loader as userGroupsLoader } from './pages/UserGroupsPage';
import AuthContextWrapper from './contexts/AuthContext';
import ToastContextWrapper from './contexts/ToastContext';

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <HomePage />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/group',
				element: <GroupFinder />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/group/:id',
				element: <GroupManager />,
				errorElement: <ErrorPage />,
				loader: groupLoader,
			},
			{
				path: '/my-groups/:authUserId',
				element: <UserGroups />,
				errorElement: <ErrorPage />,
				loader: userGroupsLoader,
			},
			{
				path: '/login',
				element: <LoginPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/logout',
				element: <Logout />,
				errorElement: <ErrorPage />,
			},
		],
	}
]);

type CombinedContextsProps = {
	children: React.ReactNode;
}

const CombinedContexts: React.FC<CombinedContextsProps> = ({ children }) => (
	<AuthContextWrapper>
		<ToastContextWrapper>
			{children}
		</ToastContextWrapper>
	</AuthContextWrapper>
);

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<CombinedContexts>
				<div className="App !text-light flex flex-col">
					<div className="flex flex-auto bg-dark">
						<Body>
							<RouterProvider router={router} />
						</Body>
					</div>
				</div>
			</CombinedContexts>
		</QueryClientProvider>
	);
}

export default App;
