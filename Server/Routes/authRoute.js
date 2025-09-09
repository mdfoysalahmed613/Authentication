import express from "express"
import { getUserData, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetOtp } from '../Controllers/authController.js';
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp)
authRouter.post("/verify-account",userAuth,verifyEmail)
authRouter.get("/me",userAuth,getUserData)
authRouter.post("/send-rest-otp",sendResetOtp)
authRouter.post("/reset-password",resetPassword)
authRouter.post("/verify-reset-otp",verifyResetOtp)


export default authRouter;