type LoginResponse = {
	access_token?: string;
	user?: any;
	success?: boolean;
	message?: string;
};

const AuthService = {
	authCheck: async () => {
		const access_token = localStorage.getItem('access_token');
		if (!access_token)
			return false;
		const urlQueryData = { access_token };
		const urlQuery = new URLSearchParams(urlQueryData).toString();
		const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/check?${urlQuery}`, {
			headers: {
				'Content-Type': 'application/json'
			},
		});
		const data = await response.json();
		if (!data.success) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('user');
		}
		return data.success;
	},

	logIn: async (email: string, password: string): Promise<LoginResponse> => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});
		const userData: LoginResponse = await response.json();
		if (userData.access_token) {
			localStorage.setItem('access_token', userData.access_token);
			localStorage.setItem('user', JSON.stringify(userData.user));
		}
		return userData;
	},

	signUp: async (name: string, email: string, password: string) => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, password })
		});
		const createdUserData = await response.json();
		if (createdUserData.success) {
			return await AuthService.logIn(email, password);
		}
		return createdUserData;
	},

	logOut: () => {
		localStorage.removeItem('access_token');
	}
};

export default AuthService;