import User from "../models/User.js";
import type { IUser } from "../models/User.js";
import sendEmail from "../services/emailService.js";
import AppError from "../utils/AppError.js";
import generateOTP from "../utils/generateOTP.js";
import generateToken from "../utils/generateToken.js";
import { getOTPExpiry } from "../utils/otpExpiry.js";
import bcrypt from "bcrypt";

// Challenges for filtering round
const challenges = [
  { link: "http://example1.com", flag: "flag{filter1}" },
  { link: "http://example2.com", flag: "flag{filter2}" },
  { link: "http://example3.com", flag: "flag{filter3}" },
];

interface SignupData {
  username: string;
  email: string;
  password: string;
  universityName?: string;
  phoneNumber: string;
}

// Signup
const signup = async ({
  username,
  email,
  password,
  universityName,
  phoneNumber,
}: SignupData) => {
  if (await User.findOne({ email }))
    throw new AppError("User already exists", 400);

  if (await User.findOne({ username }))
    throw new AppError("Username already taken", 400);

  if (await User.findOne({ phoneNumber }))
    throw new AppError("Phone number already registered", 400);

  const otp = generateOTP();
  const otpExpires = getOTPExpiry();

  // Hash password and OTP
  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedOTP = await bcrypt.hash(otp, 12);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    universityName,
    phoneNumber,
    otp: hashedOTP,
    otpExpires,
  });

  // Send email without blocking the response
  sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}`)
    .then(() => {
      console.log(`OTP email sent successfully to ${email}`);
    })
    .catch((error) => {
      console.error("Email sending error:", error);
      // Optionally remove OTP if email fails, but don't block signup
      User.updateOne(
        { _id: user._id },
        { $unset: { otp: "", otpExpires: "" } },
      ).catch((err) => console.error("Failed to clear OTP:", err));
    });

  return { message: "Signup successful, OTP sent to email" };
};

// Verify OTP
const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 400);
  if (user.isVerified) throw new AppError("User already verified", 400);
  if (!user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const isOTPValid = await bcrypt.compare(otp, user.otp);
  if (!isOTPValid) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return { message: "OTP verified, account activated" };
};

// Login
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 400);
  if (!user.isVerified) throw new AppError("Account not verified", 400);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid credentials", 400);

  const token = generateToken({ id: user._id });
  return { token, message: "Login successful" };
};

// Forgot Password
const forgetPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 400);

  const otp = generateOTP();
  const otpExpires = getOTPExpiry();
  const hashedOTP = await bcrypt.hash(otp, 12);

  user.otp = hashedOTP;
  user.otpExpires = otpExpires;
  await user.save();
  try {
    await sendEmail(
      email,
      "Your Password Reset OTP",
      `Your OTP code is: ${otp}`,
    );
    user.isVerified = false;
    await user.save();
  } catch (emailErr) {
    console.error("Email sending error:", emailErr);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    throw new AppError(
      `Failed to send OTP email: ${emailErr.message || emailErr}`,
      500,
    );
  }

  return { message: "OTP sent to email for password reset" };
};

// Reset Password
const resetPassword = async ({ email, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 400);
  if (!user.isVerified)
    throw new AppError("OTP not verified for this user", 400);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();
  return { message: "Password reset successful" };
};

// Change Password
const changePassword = async (
  { currentPassword, newPassword },
  userId: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );
  if (!isCurrentPasswordValid)
    throw new AppError("Current password is incorrect", 400);

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedNewPassword;
  await user.save();
  return { message: "Password changed successfully" };
};

// Get logged-in user info
const userInfo = (userData: IUser) => {
  // Ensure user exists (added safety)
  if (!userData) throw new AppError("Unauthorized: User not found", 401);

  // Avoid logging sensitive data in production
  if (process.env.NODE_ENV !== "production") {
    console.log("User Data:", userData);
  }
  return { success: true, userData };
};

// Get challenge for user
const getChallenge = async (user: IUser) => {
  if (user.assignedChallenge === null || user.assignedChallenge === undefined) {
    const random = Math.floor(Math.random() * 3);
    user.assignedChallenge = random;
    await user.save();
  }
  return challenges[user.assignedChallenge];
};

// Verify filtering flag
const verifyFlag = async (user: IUser, flag: string) => {
  if (user.assignedChallenge === null || user.assignedChallenge === undefined) {
    throw new AppError("No challenge assigned", 400);
  }
  if (challenges[user.assignedChallenge].flag === flag.trim()) {
    user.isEligible = true;
    await user.save();
    return {
      success: true,
      message: "Flag verified, you are now eligible for the CTF",
    };
  }
  return { success: false, message: "Incorrect flag" };
};

export {
  signup,
  verifyOtp,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  userInfo,
  getChallenge,
  verifyFlag,
};
