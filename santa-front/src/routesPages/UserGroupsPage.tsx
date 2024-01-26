import { Suspense, lazy } from 'react';
import GroupService from '../services/group.service';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Loading } from '../components/structure';
const UserGroups = lazy(() => import('../containers/userGroups/_UserGroups'));
const Title = lazy(() => import('../components/Title'));

const groupsQuery = () => ({
	queryKey: ['authUserGroups'],
	queryFn: async () => GroupService.getAllGroupsFromAuthUser(),
	staleTime: 1000 * 60 * 5, // 5 minutes
});

export const loader = (queryClient: QueryClient) => {
	return async () => {
		const query = groupsQuery();
		// we try to get data from the cache and if it doesn't exist we fetch it on the API			
		return (
			queryClient.getQueryData(query.queryKey) ??
			(await queryClient.fetchQuery(query))
		)
	}
}

const UserGroupsPage: React.FC = () => {
	const { data: groups } = useQuery(groupsQuery());

	if (!groups || groups.length === 0) {
		return <Title title={"⚠️ Vous n'appartenez pas encore à un groupe"} />;
	}

	return (
		<Suspense fallback={<Loading />}>
			<Title title={"Groupes accessibles"} />
			<UserGroups groups={groups} />
		</Suspense>
	);
}

export default UserGroupsPage;
