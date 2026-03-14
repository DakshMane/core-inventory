import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import admin from "../utils/firebase.js";

const registerUser = asyncHandler(async (req, res) => {
    const { idToken, userType, name } = req.body;

    if (!idToken) {
        throw new ApiError(400, "Firebase ID Token is required");
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      throw new ApiError(401, 'Invalid Firebase ID Token');
    }

    const existedUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (existedUser) {
        throw new ApiError(409, "User already exists. Please login instead.");
    }

    const { email, picture, uid } = decodedToken;

    const user = await User.create({
        firebaseUid: uid,
        email: email || req.body.email,
        name: name || decodedToken.name || "User",
        avatar: picture || "",
        userType: userType || "normal",
        provider: decodedToken.firebase?.sign_in_provider || "email"
    });

    const createdUser = await User.findById(user._id);

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(400, "Firebase ID Token is required");
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        throw new ApiError(401, "Invalid Firebase ID Token");
    }

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
        throw new ApiError(404, "User not found. Please register first.");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User logged in successfully")
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User profile fetched successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await admin.auth().revokeRefreshTokens(req.user.firebaseUid);

    return res.status(200).json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
});

export { registerUser, loginUser, getUserProfile, logoutUser };
