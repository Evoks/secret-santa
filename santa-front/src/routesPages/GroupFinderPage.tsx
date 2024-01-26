import { Suspense, lazy } from 'react';
import { Loading } from '../components/structure';
import { LoaderFunction, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
const GroupFinder = lazy(() => import('../containers/groupFinder/_GroupFinder'));
const Title = lazy(() => import('../components/Title'));

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const groupId = url.searchParams.get("id") || "";
	console.log(groupId);
	return { groupId };
};


const GroupFinderPage: React.FC<{}> = () => {
	const data: any = useLoaderData();

	return (
		<Suspense fallback={<Loading />}>
			<Title title={"Retrouvez votre groupe"} subtitle={"Renseignez l'identifiant de votre groupe"} />
			<GroupFinder data={data} />
		</Suspense>
	)
}

export default GroupFinderPage;
