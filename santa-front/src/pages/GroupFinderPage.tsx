import { lazy } from 'react';
const GroupFinder = lazy(() => import('../containers/groupFinder/_GroupFinder'));
const Title = lazy(() => import('../components/Title'));

const GroupFinderPage: React.FC<{}> = () => {
	return (
		<>
			<Title title={"Retrouvez votre groupe"} subtitle={"Renseignez l'identifiant de votre groupe"} />
			<GroupFinder />
		</>
	)
}

export default GroupFinderPage;
