import { Request, Response } from "express";
import { AuthUseCase } from "../use-case/authUseCase";
import catchErrors from "../utils/catchErrors";
import { loginSchema, otpVerificationSchema, userRegisterSchema } from "../zod/user-registration";
import { clearAuthCookies, generateRefreshTokenCookieOptions, getAccessTokenCookieOptions, setAuthCookies } from "../utils/setAuthCookies";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { stringToObjectId } from "../utils/bcrypt";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class AuthController {
    constructor(private readonly __authUseCase: AuthUseCase) { }



    registrationHandler = catchErrors(async (req: Request, res: Response) => {
        const userData = userRegisterSchema.parse({ ...req.body });
        const { user, accessToken, refreshToken } = await this.__authUseCase.registerUser(userData);
        return setAuthCookies({ res, accessToken, refreshToken })
            .status(CREATED)
            .json({
                success: true,
                message: `Registration successfull. An OTP has been sent to ${user.email}`,
                response: { ...user, accessToken },
            });

    })
    otpVerificationHandler = catchErrors(async (req: Request, res: Response) => {
        const userId = stringToObjectId(req.body.userId);
        const { code } = otpVerificationSchema.parse(req.body);
        console.log(typeof code)
        await this.__authUseCase.verifyOtp(code, userId);
        return res.status(OK).json({
            success: true,
            message: "Email was successfully verfied",
        });
    })
    loginHandler = catchErrors(async (req: Request, res: Response) => {
        const userData = loginSchema.parse({
            ...req.body,
        });
        const { accessToken, refreshToken, user } = await this.__authUseCase.loginUser(userData);
        return setAuthCookies({ res, accessToken, refreshToken })
            .status(OK)
            .json({
                message: "Login successful",
                response: { ...user, accessToken },
            });
    });
    refreshHandler = catchErrors(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken as string | undefined;
        appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token, please log in again");
        const { accessToken, newRefreshToken } = await this.__authUseCase.setRefreshToken(refreshToken);
        if (newRefreshToken) {
            res.cookie("refreshToken", newRefreshToken, generateRefreshTokenCookieOptions());
        }
        return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
            message: "Access token refreshed",
            accessToken,
        });
    });

    logoutHandler = catchErrors(async (req: Request, res: Response) => {
        const accessToken = req.cookies.accessToken as string | undefined;
        const { payload } = verifyToken(accessToken || "");
        if (payload) {
            await this.__authUseCase.logoutUser(payload);
        }
        return clearAuthCookies(res).status(OK).json({
            message: "Logout successful",
        });
    });

    updatePasswordHandler = catchErrors(async (req: Request, res: Response) => {
        const { userId } = req as AuthenticatedRequest;
        const { newPassword, oldPassword } = req.body
        await this.__authUseCase.updatePassword(newPassword, oldPassword, userId)
        return res.status(OK).json({
            success: true,
            message: "Password Updated Successfully"
        })
    })

    updateProfileHandler = catchErrors(async (req: Request, res: Response) => {
        const { profilePic } = req.body;
        appAssert(profilePic, BAD_REQUEST, "Profile picture is required");
        const { userId } = req as AuthenticatedRequest;

        const user = await this.__authUseCase.updateProfile(userId, profilePic);
        res.status(OK).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture,
        });
    });

}

