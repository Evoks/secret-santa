import { Suspense, lazy } from 'react';
import { Loading } from '../components/structure';
const Tests = lazy(() => import('../containers/testsPage/_TestPage'));

const TestsPage: React.FC = () => {
	return (
		<Suspense fallback={<Loading />}>
			<Tests />
		</Suspense>
	);
}

export default TestsPage;
