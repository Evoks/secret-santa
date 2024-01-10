import { hash, compare } from 'bcrypt';

export const hashString = async (plainText: string) => {
	if (!plainText || plainText.length < 1) {
		throw new Error('Invalid plainText');
	}
	const saltRounds = 10;
	return await hash(plainText, saltRounds);
};

export const compareHashes = async (plainText: string, hash: string) => {
	return await compare(plainText, hash);
};
