import mongoose from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
}


export interface IOtp {
    code: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
}
export interface ILoginUserParams {
    email: string;
    password: string;
}