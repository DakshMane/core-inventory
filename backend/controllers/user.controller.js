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

const sendOtp = asyncHandler(async (req, res) => {
    // IMPORTANT: Firebase strictly requires OTP (both SMS and Email Link) to be sent 
    // from the Client SDK (e.g. `signInWithPhoneNumber` in React) to enforce reCAPTCHA.
    // It cannot be natively sent purely from the backend Admin SDK.
    throw new ApiError(501, "Firebase does not support sending OTPs directly from the backend Admin SDK. Please use the Firebase Client SDK on your frontend to send and verify the OTP, then pass the resulting idToken to /verify-otp.");
});

const verifyOtp = asyncHandler(async (req, res) => {
    // This route should be called AFTER the frontend completes the OTP verification with Firebase
    const { idToken, name, userType } = req.body;

    if (!idToken) {
        throw new ApiError(400, "Firebase ID Token is required");
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        throw new ApiError(401, "Invalid Firebase ID Token");
    }

    const { uid, email, phone_number } = decodedToken;

    // Find the user, or create one if this is the first time they are logging in via OTP
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
        user = await User.create({
            firebaseUid: uid,
            email: email || undefined, // undefined prevents unique constraint error if empty
            name: name || "User",
            userType: userType || "normal",
            provider: decodedToken.firebase?.sign_in_provider || "phone"
        });
    }

    return res.status(200).json(
        new ApiResponse(200, user, "OTP verified and user logged in successfully")
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    try {
        // Generate a password reset link using Firebase Admin
        const link = await admin.auth().generatePasswordResetLink(email);
        
        // In a real application, you would send this link to the user's email via SendGrid, NodeMailer, etc.
        // For demonstration, we'll return it in the response.
        return res.status(200).json(
            new ApiResponse(200, { resetLink: link }, "Password reset link generated successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error generating password reset link: " + error.message);
    }
});

export { registerUser, loginUser, getUserProfile, logoutUser, sendOtp, verifyOtp, resetPassword };
