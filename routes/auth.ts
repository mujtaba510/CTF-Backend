import express from "express";
const router = express.Router();
import authController from "../controllers/authController.ts";
import authenticate from "../middleware/authenticate.ts";

// Signup
router.post("/signup", authController.signup);

// OTP Verification
router.post("/verifyOtp", authController.verifyOTP);

// Login
router.post("/login", authController.login);

// Forgot Password
router.post("/forget-password", authController.forgetPassword);

// Reset Password
router.post("/reset-password", authController.resetPassword);

// Change Password
router.put("/change-password", authenticate, authController.changePassword);

// Logout
router.post("/logout", authenticate, authController.logout);

// Get logged-in user info
router.get("/user", authenticate, authController.userInfo);

// Get challenge
router.get("/get-challenge", authenticate, authController.getChallenge);

// Verify flag
router.post("/verify-flag", authenticate, authController.verifyFlag);

export default router;
