import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Footer, Loading } from '.';

const HomeLayout: React.FC = () => {
	const navigation = useNavigation();
	const isPageLoading = navigation.state === 'loading';
	
	return (
		<>
			<Header />
			{isPageLoading ? (
				<Loading />
			) : (
				<section className='my-12 mx-auto container flex flex-col max-w-[1024px]'>
					<Outlet />
				</section>
			)}
			<Footer />
		</>
	);
};
export default HomeLayout;