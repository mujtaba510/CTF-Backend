import User from "../models/User.js";
import type { IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";

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

const searchUsers = async (query: string, currentUser: IUser) => {
  const q = (query || "").trim();
  if (!q) {
    return { success: true, users: [] };
  }

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const users = await User.find({
    _id: { $ne: currentUser._id },
    $or: [{ username: regex }, { email: regex }],
  })
    .select("_id username email")
    .limit(10);

  return { success: true, users };
};

export { getUserProfile, searchUsers };

