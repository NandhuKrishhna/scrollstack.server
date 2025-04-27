import { NextFunction, Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import { UserRole, verifyToken } from "../utils/jwt";
import catchErrors from "../utils/catchErrors";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import { UserModel } from "../models/user.model";
export interface AuthenticatedRequest extends Request {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  role: UserRole;
  user?: any;
}

const authenticate: RequestHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(accessToken, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidAccessToken);

  const { error, payload } = verifyToken(accessToken);

  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  (req as AuthenticatedRequest).userId = payload.userId;
  (req as AuthenticatedRequest).sessionId = payload.sessionId;
  (req as AuthenticatedRequest).role = payload.role;

  const user = await UserModel.findById(payload.userId).select("-password -__v").lean();
  appAssert(user, UNAUTHORIZED, "User not found", AppErrorCode.UserNotFound);

  (req as AuthenticatedRequest).user = user;
  next();
});

export default authenticate;
