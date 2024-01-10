// create a Login component that will be used to login to the application
//
// Path: src/pages/Login.tsx
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Logout: React.FC = () => {
	const navigation = useNavigate();
	AuthService.logOut();

	setTimeout(() => {
		navigation('/');
	}, 1000);
	return (
		<div className="flex flex-col items-center justify-center flex-1">
			Deconnexion en cours...
		</div>
	);
}

export default Logout;