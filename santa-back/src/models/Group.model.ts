import mongoose from 'mongoose';
import IGroup from 'src/types/IGroup.type';

const GroupSchema = new mongoose.Schema(
	{
		name: String,
		mainUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		exclusions: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				excludedUsers: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User',
					},
				],
			},
		],
		associations: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				associatedUser: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
		dueDate: Date,
	},
	{
		versionKey: false,
	},
);

export default mongoose.model<IGroup & mongoose.Document>('Group', GroupSchema);
