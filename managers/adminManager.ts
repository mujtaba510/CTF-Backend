import User from "../models/User.js";
import Team from "../models/Team.js";
import ChallengeSubmission from "../models/ChallengeSubmission.js";
import ChallengeFileSubmission from "../models/ChallengeFileSubmission.js";
import type { IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";

// Get paginated users with search (admin only)
const getUsers = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;
  
  let query = {};
  if (search) {
    // Search by username or email
    query = {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .select("-password -otp -otpExpires") // Exclude sensitive fields
    .sort({ createdAt: -1 });
  
  const total = await User.countDocuments(query);
  return { users, total, page, limit };
};

// Get single user with details (admin only)
const getUserDetail = async (userId: string) => {
  const user = await User.findById(userId).select("-password -otp -otpExpires");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get user's team
  const team = await Team.findOne({ members: userId })
    .populate("owner", "username email")
    .populate("members", "username email");

  // Get user's challenge submissions
  const challengeSubmissions = await ChallengeSubmission.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  // Get user's file submissions
  const fileSubmissions = await ChallengeFileSubmission.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  return {
    user,
    team,
    challengeSubmissions,
    fileSubmissions,
  };
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

// Get paginated challenge submissions (CTF Machines)
const getChallengeSubmissions = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;
  
  let query = {};
  if (search) {
    // Search by machineId or submittedFlag
    query = {
      $or: [
        { machineId: { $regex: search, $options: "i" } },
        { submittedFlag: { $regex: search, $options: "i" } },
      ],
    };
  }

  const submissions = await ChallengeSubmission.find(query)
    .skip(skip)
    .limit(limit)
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  
  const total = await ChallengeSubmission.countDocuments(query);
  return { submissions, total, page, limit };
};

// Get paginated file submissions (CTF Challenges)
const getFileSubmissions = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;
  
  let query = {};
  if (search) {
    // Search by challengeId or status
    query = {
      $or: [
        { challengeId: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    };
  }

  const submissions = await ChallengeFileSubmission.find(query)
    .skip(skip)
    .limit(limit)
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
  
  const total = await ChallengeFileSubmission.countDocuments(query);
  return { submissions, total, page, limit };
};

// Get team leaderboard sorted by points
const getTeamLeaderboard = async () => {
  const teams = await Team.find({})
    .select("name points solvedMachines members owner createdAt")
    .populate("owner", "username")
    .populate("members", "username")
    .sort({ points: -1, createdAt: 1 }) // Sort by points desc, then by creation date (tiebreaker)
    .lean();

  return teams.map((team: any, index: number) => ({
    rank: index + 1,
    _id: team._id,
    name: team.name,
    points: team.points || 0,
    solvedCount: team.solvedMachines?.length || 0,
    memberCount: team.members?.length || 0,
    owner: team.owner?.username || "Unknown",
    members: team.members?.map((m: any) => m.username) || [],
  }));
};

export { getUsers, getUserDetail, deleteUser, getChallengeSubmissions, getFileSubmissions, getTeamLeaderboard };
