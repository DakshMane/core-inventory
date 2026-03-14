import admin from "../utils/firebase.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, "No auth token provided");
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            throw new ApiError(401, "Invalid access token: User not found");
        }

        req.user = user;
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
