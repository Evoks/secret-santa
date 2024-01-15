import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Body, ErrorPage } from './components/structure';
// pages
import { Error, Layout, HomePage, GroupManager, UserGroups, GroupFinder, LoginPage, Logout } from './routes';
// loaders
import { loader as groupLoader } from './routes/GroupManagerPage';
import { loader as userGroupsLoader } from './routes/UserGroupsPage';
import AuthContextWrapper from './contexts/AuthContext';
import ToastContextWrapper from './contexts/ToastContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime:	1000 * 60 * 5, // 5 minutes
		}
	}
});

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
				loader: groupLoader(queryClient),
			},
			{
				path: '/my-groups',
				element: <UserGroups />,
				errorElement: <ErrorPage />,
				loader: userGroupsLoader(queryClient),
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
				<ReactQueryDevtools initialIsOpen={false} />
			</CombinedContexts>
		</QueryClientProvider>
	);
}

export default App;
