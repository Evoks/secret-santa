import * as dotenv from 'dotenv';
dotenv.config();
import { connect, disconnect, set } from 'mongoose';
import * as os from 'os';

class MongoService {
	constructor() {}

	async connect() {
		const opts = {
			authSource: 'admin',
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASSWORD,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
		};
		set('strictQuery', true);
		console.log('connect to', process.env.MONGO_STRING);
		try {
			await connect(process.env.MONGO_STRING, opts);
			console.log(os.hostname(), 'Mongo is connected!');
		} catch (err) {
			console.error('Mongo is NOT connected!', err);
			process.exit(1);
		}
	}

	disconnect() {
		console.log('Mongo is disconnected!');
		disconnect();
	}
}
export default MongoService;
