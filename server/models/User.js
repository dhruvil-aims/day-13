import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, min: [6, 'Password must be 6 letters or above.'] },
}, { timestamps: true });
export default mongoose.model("User", UserSchema);