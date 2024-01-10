import { lazy } from 'react';
const FormGroupCreation = lazy(() => import('../containers/createGroup/_FormGroupCreation'));

const HomePage: React.FC = () => {
	return (
		<FormGroupCreation />
	);
}

export default HomePage;
