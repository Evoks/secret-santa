import { Suspense, lazy } from 'react';
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import { QueryClient, useQuery } from '@tanstack/react-query'
import GroupService from '../services/group.service';
import { Loading } from '../components/structure';
const GroupManager = lazy(() => import('../containers/groupManager/_GroupManager'));
const Title = lazy(() => import('../components/Title'));

const groupQuery = (groupId: string) => ({
	queryKey: ['group', groupId],
	queryFn: async () => GroupService.get(groupId),
	staleTime: 1000 * 60 * 5, // 5 minutes
});

export const loader = (queryClient: QueryClient) => {
	return async ({ params }: LoaderFunctionArgs) => {
		if (params.id) {
			const query = groupQuery(params.id);
			// we try to get data from the cache and if it doesn't exist we fetch it on the API			
			return (
				queryClient.getQueryData(query.queryKey) ??
				(await queryClient.fetchQuery(query))
			)
		}
	}
}

const GroupManagerPage: React.FC = () => {
	const params = useParams()
	const { data: group } = useQuery(groupQuery(params.id as string));

	if (!group) return <Title title={"Erreur de chargement du groupe"} subtitle='Verifiez que le groupe existe...' />

	return (
		<Suspense fallback={<Loading />}>
			<Title title={"Gestion du groupe"} />
			<GroupManager group={group} />
		</Suspense>
	);
}

export default GroupManagerPage;
