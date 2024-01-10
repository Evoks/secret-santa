import mongoose from 'mongoose';
import IUser from '../types/IUser.type';

const UserSchema = new mongoose.Schema(
	{
		name: String,
		email: String || null,
		pwdHash: String || null,
		registrationToken: String || null,
		lastLogin: Date || null,
		registered: Boolean,
	},
	{
		versionKey: false,
	},
);

export default mongoose.model<IUser & mongoose.Document>('User', UserSchema);
