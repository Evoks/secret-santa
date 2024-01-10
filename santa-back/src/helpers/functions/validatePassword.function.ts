import CustomError from '../classes/CustomError.class';

const validatePassword = (password: string) => {
	if (!password || password.length < 1) {
		throw new CustomError('Invalid password, length is not valid', 'Password validation');
	}
	const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
	if (!regex.test(password)) {
		throw new CustomError('Invalid password, test is not valid', 'Password validation');
	}
};

export default validatePassword;
