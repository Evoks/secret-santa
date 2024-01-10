import { createContext, useEffect, useState } from "react";
import User from "../types/User";
import AuthService from "../services/auth.service";

type AuthContextType = {
	authUser: User | null;
	setAuthUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
	authUser: null,
	setAuthUser: () => { },
});

type AuthContextWrapperProps = {
	children: React.ReactNode;
}

const AuthContextWrapper: React.FC<AuthContextWrapperProps> = ({ children }) => {
	const [authUser, setAuthUser] = useState<User | null>(null);
	useEffect(() => {
		const checkUserLoggedIn = async () => {
			const user = localStorage.getItem('user');
			if (user) {
				const userLoggedIn = await AuthService.authCheck();
				if (userLoggedIn) {
					setAuthUser(JSON.parse(user));
					return ;
				}
			}
			setAuthUser(null);
		};
		checkUserLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContextWrapper;