import mongoose from "mongoose";
import { IOtpDocument } from "../models/otp.model";

export interface IOptverificationRepository {
  saveOtp(otp: Partial<IOtpDocument>): Promise<IOtpDocument>;
  findOtpById(code: string, user: mongoose.Types.ObjectId): Promise<IOtpDocument | null>;
  deleteOtp(id: mongoose.Types.ObjectId): Promise<void>;
  deleteOtpByUserId(userId: mongoose.Types.ObjectId): Promise<void>;
  countVerificationCodes(userId: mongoose.Types.ObjectId, type: string, time: Date): Promise<number>;
}

