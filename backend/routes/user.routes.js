import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", verifyToken, logoutUser);

export default router;
