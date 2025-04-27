import mongoose from "mongoose";
import { ISessionDocument } from "../models/session.model";

export interface ISessionRepository {
  createSession(session: Partial<ISessionDocument>): Promise<ISessionDocument>;
  findByIdAndDelete(id: mongoose.Types.ObjectId): Promise<ISessionDocument | null>;
  findById(id: mongoose.Types.ObjectId): Promise<ISessionDocument | null>;
  updateSession(id: mongoose.Types.ObjectId, updates: Partial<ISessionDocument>): Promise<ISessionDocument | null>;
  deleteMany(id: mongoose.Types.ObjectId): Promise<void>;
  deleteSessionByID(id: mongoose.Types.ObjectId): Promise<void>;
}

