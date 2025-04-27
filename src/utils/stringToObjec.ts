import mongoose from "mongoose";

export const stringToObjectId = (id: string): mongoose.Types.ObjectId => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ObjectId format");
    }
    return new mongoose.Types.ObjectId(id);
};