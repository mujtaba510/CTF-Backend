import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.ts";
import * as authManager from "../managers/authManager.ts";
import AppError from "../utils/AppError.ts";
import {
  signupSchema,
  otpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../schemaValidation/auth.schema.ts";

// Signup
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SignupRequest"
 *     responses:
 *       201:
 *         description: Signup successful, OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signup successful, OTP sent to email
 *       400:
 *         description: User already exists or invalid data
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = signupSchema.parse(req.body);
    const result = await authManager.signup(validated);
    res.status(201).json(result);
  }
);

// OTP Verification
/**
 * @swagger
 * /api/auth/verifyOtp:
 *   post:
 *     summary: Verify OTP for account activation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/OtpRequest"
 *     responses:
 *       200:
 *         description: OTP verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified, account activated
 *       400:
 *         description: Invalid or expired OTP
 */
export const verifyOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = otpSchema.parse(req.body);
    const result = await authManager.verifyOtp(validated);
    res.json(result);
  }
);

// Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Invalid credentials
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = loginSchema.parse(req.body);
    const { token, message } = await authManager.login(validated);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    }); // 1 day
    res.json({ message });
  }
);

// Forgot Password - send OTP to email
/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ForgetPasswordRequest"
 *     responses:
 *       200:
 *         description: OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to email for password reset
 *       400:
 *         description: User not found
 */
export const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = forgetPasswordSchema.parse(req.body);
    const result = await authManager.forgetPassword(validated);
    res.json(result);
  }
);

// Reset Password - set new password (after OTP verified)
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResetPasswordRequest"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       400:
 *         description: OTP not verified
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = resetPasswordSchema.parse(req.body);
    const result = await authManager.resetPassword(validated);
    res.json(result);
  }
);

// Change Password
/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change password for authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordRequest"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Current password incorrect or invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = changePasswordSchema.parse(req.body);
    const result = await authManager.changePassword(
      validated,
      req.user._id.toString()
    );
    res.json(result);
  }
);

// Logout
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 */
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  }
);

// Get logged-in user info
/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get logged-in user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userData:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
const userInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = authManager.userInfo(req.user);
    return res.status(200).json(result);
  }
);

// Get challenge
/**
 * @swagger
 * /api/auth/get-challenge:
 *   get:
 *     summary: Get assigned challenge for filtering round
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Challenge retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 link:
 *                   type: string
 *                   example: http://example.com
 */
const getChallenge = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const challenge = await authManager.getChallenge(req.user);
    return res.status(200).json({ success: true, link: challenge.link });
  }
);

// Verify flag
/**
 * @swagger
 * /api/auth/verify-flag:
 *   post:
 *     summary: Verify filtering flag
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag:
 *                 type: string
 *                 example: flag{filter1}
 *     responses:
 *       200:
 *         description: Flag verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 */
const verifyFlag = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { flag } = req.body;
    if (!flag) throw new AppError("Flag is required", 400);
    const result = await authManager.verifyFlag(req.user, flag);
    return res.status(200).json(result);
  }
);

export default {
  signup,
  verifyOTP,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  logout,
  userInfo,
  getChallenge,
  verifyFlag,
};
