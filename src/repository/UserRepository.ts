import mongoose from "mongoose";
import { IUserRepository } from "../interface/IUserRepository";
import { IUserDocument, UserModel } from "../models/user.model";


export class UserRepository implements IUserRepository {
  async createUser(user: Partial<IUserDocument>): Promise<IUserDocument> {
    const result = await UserModel.create(user)
    return result;
  }
  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    const result = await UserModel.findOne({ email })
    return result;
  }
  async updateUserStatus(email: string, isActive: boolean): Promise<void> {
    await UserModel.updateOne({ email }, { isActive });
  }

  async updateUserById(id: mongoose.Types.ObjectId, updates: Partial<IUserDocument>): Promise<IUserDocument | null> {
    const result = await UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return result;
  }

  async updateUserByEmail(email: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null> {
    const result = await UserModel.findOneAndUpdate({ email }, { $set: updates }, { new: true });
    return result;
  }
  async findUserById(id: mongoose.Types.ObjectId): Promise<IUserDocument | null> {
    const user = await UserModel.findById(id)
      .select("-password -__v -createdAt -updatedAt");
    return user;
  }

  async updateProfile(userId: mongoose.Types.ObjectId, profilePic: string): Promise<IUserDocument | null> {

    const result = await UserModel.findOneAndUpdate(
      { _id: userId },
      { profilePicture: profilePic },
      { new: true, fields: "_id name email profilePicture role" }
    );
    return result;
  }
  async updateUserPassword(id: mongoose.Types.ObjectId, hashedPassword: string) {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );
  }



}
