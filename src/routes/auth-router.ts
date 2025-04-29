import { Router } from 'express';
import { initializeDependencies } from '../config/dp';



const authRouter = Router();
const { authController, articleController } = initializeDependencies();
authRouter.post("/registration", authController.registrationHandler)
authRouter.post("/otp-verification", authController.otpVerificationHandler)
authRouter.post("/login", authController.loginHandler)
authRouter.get("/refresh", authController.refreshHandler);
authRouter.get("/logout", authController.logoutHandler);
authRouter.get("/get-all-articles", articleController.getAllArticlesHandler);
export default authRouter;