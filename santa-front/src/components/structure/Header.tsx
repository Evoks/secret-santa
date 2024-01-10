import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Dropdown } from 'flowbite-react';

const Header: React.FC<any> = (): any => {
	const { authUser } = useContext(AuthContext);

	return (
		<header className="body-font bg-white/5">
			<div className="mx-auto container flex flex-col max-w-[1024px]">
				<div className="container mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
					<a href="/" className="flex font-bold items-center mb-4 md:mb-0">
						<span className="ml-3 text-3xl text-gradient-blue-purple">Secret Santa</span>
					</a>
					<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
						<a href="/" className="text-white mr-5 hover:text-gray-400">Créer un groupe</a>
						<a href="/group" className="text-white mr-5 hover:text-gray-400">Retrouver un groupe</a>
						{authUser && (
							<>
								<Dropdown color="gray" label={authUser.name} dismissOnClick={false}>
									<Dropdown.Item>
										<a href="/logout" className="mr-5 hover:text-gradient-blue-purple">Se déconnecter</a>
									</Dropdown.Item>
								</Dropdown>
							</>
						)}
						{!authUser && (
							<a href="/login" className="mr-5 hover:text-gradient-blue-purple">Se connecter</a>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}

export default Header;
