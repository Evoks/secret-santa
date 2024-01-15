import { Suspense, lazy } from 'react';
import { Loading } from '../components/structure';
const GroupFinder = lazy(() => import('../containers/groupFinder/_GroupFinder'));
const Title = lazy(() => import('../components/Title'));

const GroupFinderPage: React.FC<{}> = () => {
	return (
		<Suspense fallback={<Loading/>}>
			<Title title={"Retrouvez votre groupe"} subtitle={"Renseignez l'identifiant de votre groupe"} />
			<GroupFinder />
		</Suspense>
	)
}

export default GroupFinderPage;
