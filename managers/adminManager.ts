import User from "../models/User.ts";
import type { IUser } from "../models/User.ts";
import AppError from "../utils/AppError.ts";

// Get paginated users (admin only)
const getUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select("-password -otp -otpExpires"); // Exclude sensitive fields
  const total = await User.countDocuments();
  return { users, total, page, limit };
};

// Delete user by ID (admin only)
const deleteUser = async (id: string, currentUser: IUser) => {
  const userToDelete = await User.findById(id);
  if (!userToDelete) {
    throw new AppError("User not found", 404);
  }

  await User.findByIdAndDelete(id);
  return { success: true, message: "User deleted successfully" };
};

export { getUsers, deleteUser };
