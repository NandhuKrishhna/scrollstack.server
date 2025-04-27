import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
import { hashPassword } from "../utils/bcrypt";
export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    isVerified: boolean;
    preferences: string[];
    comparePassword(val: string): Promise<boolean>;

}

const UserSchema = new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
        type: String,
        required: false,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    isVerified: { type: Boolean, default: false },
    preferences: { type: [String], default: [] },
});
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hashPassword(this.password as string);
});
UserSchema.methods.comparePassword = async function (val: string): Promise<boolean> {
    return bcrypt.compare(val, this.password);
}

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
