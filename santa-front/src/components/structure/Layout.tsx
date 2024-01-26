import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Footer, Loading } from '.';
import React from 'react';

const HomeLayout: React.FC = () => {
	const navigation = useNavigation();
	const isPageLoading = navigation.state === 'loading';
	
	return (
		<React.Fragment>
			<Header />
			{isPageLoading ? (
				<Loading />
			) : (
				<section className='my-12 mx-auto container flex flex-col max-w-[1024px]'>
					<Outlet />
				</section>
			)}
			<Footer />
		</React.Fragment>
	);
};
export default HomeLayout;