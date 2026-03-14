import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser, sendOtp, verifyOtp, resetPassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", verifyToken, logoutUser);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
