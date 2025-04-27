import mongoose, { Document, Model, Schema } from "mongoose";


export interface IOtpDocument extends Document {
    userId: mongoose.Types.ObjectId;
    code: string
    expiresAt: Date;
    createdAt: Date;

}

const otpVerificaionSchema = new Schema<IOtpDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OtpVerficationModel: Model<IOtpDocument> =
    mongoose.model<IOtpDocument>("OtpVerfication", otpVerificaionSchema, "otp_verfication");
export default OtpVerficationModel;
