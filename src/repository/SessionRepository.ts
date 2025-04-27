import mongoose from "mongoose";
import { ISessionRepository } from "../interface/ISessionRepository";
import SessionModel, { ISessionDocument } from "../models/session.model";

export class SessionRepository implements ISessionRepository {
  // create session
  async createSession(session: Partial<ISessionDocument>): Promise<ISessionDocument> {
    const createdSession = await SessionModel.create(session);
    return createdSession as ISessionDocument;
  }
  // delete session
  async findByIdAndDelete(id: mongoose.Types.ObjectId): Promise<ISessionDocument | null> {
    return await SessionModel.findByIdAndDelete(id).exec();
  }
  // find session by id
  async findById(id: mongoose.Types.ObjectId): Promise<ISessionDocument | null> {
    return await SessionModel.findById(id);
  }
  // update session
  async updateSession(id: mongoose.Types.ObjectId, updates: Partial<ISessionDocument>): Promise<ISessionDocument | null> {
    return await SessionModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
  }

  // session delete many
  async deleteMany(id: mongoose.Types.ObjectId): Promise<void> {
    await SessionModel.deleteMany({ userId: id }).exec();
  }

  async deleteSessionByID(id: mongoose.Types.ObjectId): Promise<void> {
    await SessionModel.deleteMany({ userId: id }).exec();
  }
}
