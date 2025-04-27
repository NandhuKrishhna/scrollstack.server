import { Router } from 'express';
import { initializeDependencies } from '../config/dp';



const authRouter = Router();
const { authController } = initializeDependencies();
authRouter.post("/registration", authController.registrationHandler)
authRouter.post("/otp-verification", authController.otpVerificationHandler)
authRouter.post("/login", authController.loginHandler)
authRouter.get("/refresh", authController.refreshHandler);
authRouter.get("/logout", authController.logoutHandler);
export default authRouter;