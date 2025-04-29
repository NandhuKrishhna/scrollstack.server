import mongoose from "mongoose";
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import { IOptverificationRepository } from "../interface/IOtpReposirtory";
import { ISessionRepository } from "../interface/ISessionRepository";
import { IUserRepository } from "../interface/IUserRepository";
import { ILoginUserParams, IUser } from "../types/user";
import appAssert from "../utils/appAssert";
import { generateOtpExpiration, ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { generateOTP } from "../utils/otpGenerator";
import { sendMail } from "../services/nodemailer";
import { getVerifyEmailTemplates } from "../utils/otpTemplate";
import { AccessTokenPayload, RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import AppErrorCode from "../constants/appErrorCode";
import { hashPassword } from "../utils/bcrypt";
import cloudinary from "../services/cloudinary";

export class AuthUseCase {
    constructor(private readonly __userRepository: IUserRepository,
        private readonly __otpRespository: IOptverificationRepository,
        private readonly __sessionRepository: ISessionRepository
    ) { }


    async registerUser(userData: IUser) {
        const existingUser = await this.__userRepository.findUserByEmail(userData.email);
        appAssert(!existingUser, CONFLICT, "User already exists");
        const newUser = await this.__userRepository.createUser({
            name: userData.name,
            email: userData.email,
            password: userData.password,
        });
        const otp = await this.__otpRespository.saveOtp({
            userId: newUser._id as mongoose.Types.ObjectId,
            code: generateOTP(),
            expiresAt: generateOtpExpiration()
        })
        await sendMail({
            to: newUser.email,
            ...getVerifyEmailTemplates(otp.code, newUser.name)
        })
        // @des : generating session for the user
        const newSession = await this.__sessionRepository.createSession({
            userId: newUser._id as mongoose.Types.ObjectId,
            expiresAt: oneYearFromNow()
        })
        const session: RefreshTokenPayload = {
            sessionId: newSession._id ?? new mongoose.Types.ObjectId(),
            role: "user"
        };

        const accessToken = signToken({
            ...session,
            userId: newUser._id as mongoose.Types.ObjectId,
            role: "user"
        })
        const refreshToken = signToken(session, refreshTokenSignOptions);
        return {
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture,

            },
            accessToken,
            refreshToken,
        }


    }

    // @des : verify otp for the user
    async verifyOtp(code: string, userId: mongoose.Types.ObjectId) {
        appAssert(code, CONFLICT, "Code is required");
        appAssert(userId, CONFLICT, "UserId is required");
        const otp = await this.__otpRespository.findOtpById(code, userId);
        console.log("OTP", otp);
        appAssert(otp, CONFLICT, "Invalid or expired OTP", AppErrorCode.InvalidOtpCode);
        appAssert(otp.expiresAt > new Date(), CONFLICT, "OTP expired");

        const updatedUser = await this.__userRepository.updateUserById(otp.userId, { isVerified: true });
        appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");
        await this.__otpRespository.deleteOtp(otp._id as mongoose.Types.ObjectId);
        return {
            user: updatedUser,
        };
    }

    async loginUser(userData: ILoginUserParams) {
        const existingUser = await this.__userRepository.findUserByEmail(userData.email);
        appAssert(existingUser, UNAUTHORIZED, "Invalid email or password");
        const isPasswordMatched = await existingUser.comparePassword(userData.password);
        appAssert(isPasswordMatched, UNAUTHORIZED, "Invalid email or password");


        const newSession = await this.__sessionRepository.createSession({
            userId: existingUser._id as mongoose.Types.ObjectId,
            expiresAt: oneYearFromNow()
        })

        const session: RefreshTokenPayload = {
            sessionId: newSession._id ?? new mongoose.Types.ObjectId(),
            role: "user"
        };

        const accessToken = signToken({
            ...session,
            userId: existingUser._id as mongoose.Types.ObjectId,
            role: "user"
        })
        const refreshToken = signToken(session, refreshTokenSignOptions);
        return {
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                profilePicture: existingUser.profilePicture,

            },
            accessToken,
            refreshToken,
        }
    };

    async logoutUser(payload: AccessTokenPayload) {
        await this.__sessionRepository.findByIdAndDelete(payload.sessionId);
    };

    //@des : refresh token
    async setRefreshToken(refreshToken: string) {
        const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
            secret: refreshTokenSignOptions.secret,
        });
        appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
        const session = await this.__sessionRepository.findById(payload.sessionId);
        appAssert(session && session.expiresAt.getTime() > Date.now(), UNAUTHORIZED, "Session expired");
        const sessionNeedsRefresh = session.expiresAt.getTime() - Date.now() <= ONE_DAY_MS;
        if (sessionNeedsRefresh) {
            await this.__sessionRepository.updateSession(session._id!, {
                expiresAt: thirtyDaysFromNow(),
            });
        }

        const newRefreshToken = sessionNeedsRefresh
            ? signToken(
                {
                    sessionId: session._id!,
                    role: payload.role,
                },
                refreshTokenSignOptions
            )
            : refreshToken;
        const accessToken = signToken({
            userId: session.userId,
            sessionId: session._id!,
            role: "user",
        });
        return {
            accessToken,
            newRefreshToken,
        };
    }

    async updatePassword(newPassword: string, oldPassword: string, userId: mongoose.Types.ObjectId) {
        appAssert(newPassword, NOT_FOUND, "Password is missing. Please enter your new password.");
        appAssert(newPassword !== oldPassword, CONFLICT, "New password must be different from the current password.");

        const user = await this.__userRepository.findUserById(userId);
        appAssert(user, NOT_FOUND, "User not found");

        const isValidPassword = await user.comparePassword(oldPassword);
        appAssert(isValidPassword, CONFLICT, "Current Password is not correct.");

        const hashedPassword = await hashPassword(newPassword);
        await this.__userRepository.updateUserPassword(userId, hashedPassword);

        return { message: "Password updated successfully." };
    }


    async updateProfile(userId: mongoose.Types.ObjectId, profilePic: string) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await this.__userRepository.updateProfile(userId, uploadResponse.secure_url);
        appAssert(updatedUser, BAD_REQUEST, "Failed to update profile");
        return updatedUser;
    }



}