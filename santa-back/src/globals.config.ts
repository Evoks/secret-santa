import MongoManager from './db/mongo';

class Globals {
	async init() {
		const mongoManager = new MongoManager();
		await mongoManager.connect();
	}
}

export default new Globals();
