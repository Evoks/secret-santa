import { storage } from "../utils/storage";

type LoginResponse = {
	access_token?: string;
	user?: any;
	success?: boolean;
	message?: string;
};

const AuthService = {
	authCheck: async () => {
		const access_token = storage.getItem('access_token');
		if (!access_token)
			return false;
		const urlQueryData = { access_token };
		const urlQuery = new URLSearchParams(urlQueryData).toString();
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/auth/check?${urlQuery}`, {
				headers: {
					'Content-Type': 'application/json'
				},
			});
			const data = await response.json();
			if (!data.success) {
				storage.removeItem('access_token');
				storage.removeItem('user');
			}
			return data.success;
		} catch (e) {
			return false;
		}
	},

	logIn: async (email: string, password: string): Promise<LoginResponse> => {
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});
			const userData: LoginResponse = await response.json();
			if (userData.access_token) {
				storage.setItem('access_token', userData.access_token);
				storage.setItem('user', JSON.stringify(userData.user));
			}
			return userData;
		} catch (e) {
			return { success: false, message: 'Une erreur est survenue' };
		}
	},

	signUp: async (name: string, email: string, password: string, userId: string | null = null) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, password, userId })
			});
			const createdUserData = await response.json();
			if (createdUserData.success) {
				return await AuthService.logIn(email, password);
			}
			return createdUserData;
		} catch (e) {
			return { success: false, message: 'Une erreur est survenue' };
		}
	},

	logOut: () => {
		storage.removeItem('access_token');
	}
};

export default AuthService;