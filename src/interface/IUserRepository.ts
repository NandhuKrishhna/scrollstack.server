import mongoose from "mongoose";
import { IUserDocument } from "../models/user.model";


export interface IUserRepository {
  createUser(user: Partial<IUserDocument>): Promise<IUserDocument>;
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  updateUserStatus(email: string, isActive: boolean): Promise<void>;
  updateUserById(id: mongoose.Types.ObjectId, updates: Partial<IUserDocument>): Promise<IUserDocument | null>;
  updateUserByEmail(email: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null>;
  findUserById(id: mongoose.Types.ObjectId): Promise<IUserDocument | null>;

}

