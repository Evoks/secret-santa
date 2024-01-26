import { ErrorPage } from "./components/structure";
import TestsPage from "./routesPages/TestsPage";
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from "react-router-dom";
import {
	Error,
	Layout,
	HomePage,
	GroupManager,
	UserGroups,
	GroupFinder,
	LoginPage,
	Logout
} from './routesPages';
// loaders
import { loader as groupLoader } from './routesPages/GroupManagerPage';
import { loader as userGroupsLoader } from './routesPages/UserGroupsPage';
import { loader as groupFinderLoader } from './routesPages/GroupFinderPage';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
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
				loader: groupFinderLoader,
			},
			{
				path: '/tests',
				element: <TestsPage />,
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

export default router;