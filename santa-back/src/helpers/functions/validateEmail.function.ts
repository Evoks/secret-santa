import CustomError from '../classes/CustomError.class';

const validateEmail = (email: string) => {
	if (!email || email.length < 1) {
		throw new CustomError('Invalid email', 'Email validation');
	}
	const regex = /^[\w-.]+@([\w\-]+\.)+[\w-]{2,4}$/;
	if (!regex.test(email)) {
		throw new CustomError('Invalid email', 'Email validation');
	}
};

export default validateEmail;
