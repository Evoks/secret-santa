import { Suspense, lazy } from 'react';
import { Loading } from '../components/structure';
const FormGroupCreation = lazy(() => import('../containers/createGroup/_FormGroupCreation'));

const HomePage: React.FC = () => {
	return (
		<Suspense fallback={<Loading />}>
			<FormGroupCreation />
		</Suspense>
	);
}

export default HomePage;
