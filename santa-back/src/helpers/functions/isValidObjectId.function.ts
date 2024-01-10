import mongoose from 'mongoose';

const isValidObjectId = (id: string) => {
	if (!id) return false;
	return mongoose.Types.ObjectId.isValid(id);
};

export default isValidObjectId;
