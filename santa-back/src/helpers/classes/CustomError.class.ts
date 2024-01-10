export default class CustomError extends Error {
	scope: string;

	constructor(message: string, scope: string = 'App') {
		super(message);
		this.scope = scope;
		this.name = 'CustomError';
	}
}
