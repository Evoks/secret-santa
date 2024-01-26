import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Dropdown } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React from 'react';

const Header: React.FC<any> = (): any => {
	const { authUser } = useContext(AuthContext);

	return (
		<header className="body-font bg-white/5">
			<div className="mx-auto container flex flex-col max-w-[1024px]">
				<div className="container mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
					<Link to="/" className="flex font-bold items-center mb-4 md:mb-0">
						<span className="ml-3 text-3xl text-gradient-blue-purple flex flex-row">
							<img src="/128.png" alt="Logo" className="w-10 h-10 mr-1" />
							Secret Santa
						</span>
					</Link>
					<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
						<Link to="/" className="text-white mr-5 hover:text-gray-400">Créer un groupe</Link>
						<Link to="/group" className="text-white mr-5 hover:text-gray-400">Retrouver un groupe</Link>
						{authUser && (
							<React.Fragment>
								<Dropdown color="gray" label={authUser.name} dismissOnClick={false}>
									<Dropdown.Header className='flex flex-row items-center'>
										<FontAwesomeIcon icon={faUser} className="mr-5 text-gray-500" />
										<div>
											<span className="block text-sm font-medium">
												{authUser.name}
											</span>
											<span className="block truncate text-sm font-light">
												{authUser.email}
											</span>
										</div>
									</Dropdown.Header>
									<Dropdown.Item href={`/my-groups`} className=" hover:text-gradient-blue-purple">
										<FontAwesomeIcon icon={faUserGroup} className="mr-5 text-gray-500" />
										<div>Mes groupes</div>
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item href="/logout" className="mr-5 hover:text-gradient-blue-purple">
										<FontAwesomeIcon icon={faSignOut} className="mr-5 text-gray-500" />
										<div>Se déconnecter</div>
									</Dropdown.Item>
								</Dropdown>
							</React.Fragment>
						)}
						{!authUser && (
							<Link to="/login" className="mr-5 hover:text-gradient-blue-purple">Se connecter</Link>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}

export default Header;
