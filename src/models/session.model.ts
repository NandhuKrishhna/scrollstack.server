import mongoose, { model, Schema } from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface ISessionDocument extends Document {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
    createdAt: Date;
}

const sessionSchema = new Schema<ISessionDocument>({
    userId: {
        ref: "User",
        type: Schema.Types.ObjectId,
        index: true,
        required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, default: thirtyDaysFromNow },
});

const SessionModel = model<ISessionDocument>("Session", sessionSchema);
export default SessionModel;
