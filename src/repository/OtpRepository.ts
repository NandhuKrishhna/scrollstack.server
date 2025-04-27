import mongoose from "mongoose";
import { IOptverificationRepository } from "../interface/IOtpReposirtory";
import OtpVerficationModel, { IOtpDocument } from "../models/otp.model";



export class OtpRepository implements IOptverificationRepository {
  async saveOtp(otp: Partial<IOtpDocument>): Promise<IOtpDocument> {
    const result = await OtpVerficationModel.create(otp);
    return result
  }
  async findOtpById(code: string, userId: mongoose.Types.ObjectId): Promise<IOtpDocument | null> {

    const otpEntry = await OtpVerficationModel.findOne({
      code: code,
      userId: userId,
      expiresAt: { $gt: new Date() },
    });

    return otpEntry
  }

  // delete after verification
  async deleteOtp(id: mongoose.Types.ObjectId): Promise<void> {
    await OtpVerficationModel.deleteOne({ _id: id });
  }
  async deleteOtpByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
    await OtpVerficationModel.deleteMany({ userId });
  }
  // count documents in collection
  async countVerificationCodes(id: mongoose.Types.ObjectId, type: string, time: Date): Promise<number> {
    const result = await OtpVerficationModel.countDocuments({
      userId: id,
      type: type,
      createdAt: { $gt: time },
    });
    return result;
  }
}
