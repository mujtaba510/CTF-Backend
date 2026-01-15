import User from "../models/User.ts";
import type { IUser } from "../models/User.ts";
import AppError from "../utils/AppError.ts";

// Get user profile by ID
const getUserProfile = async (id: string, currentUser: IUser) => {
  if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
    throw new AppError("You are not authorized to access this profile", 403);
  }

  const profileUser = await User.findById(id).select(
    "-password -otp -otpExpires"
  );

  if (!profileUser) {
    throw new AppError("Profile not found", 404);
  }

  return { success: true, user: profileUser };
};

export { getUserProfile };
