import Cookie from 'js-cookie';

export const storage = {
	getItem: (key: string) => {
		return Cookie.get(key);
	},
	setItem: (key: string, value: string) => {
		Cookie.set(key, value);
	},
	removeItem: (key: string) => {
		Cookie.remove(key);
	}
};