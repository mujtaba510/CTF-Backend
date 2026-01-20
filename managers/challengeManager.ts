import User from "../models/User.ts";
import ChallengeSubmission from "../models/ChallengeSubmission.ts";
import type { IUser } from "../models/User.ts";
import AppError from "../utils/AppError.ts";

// Dummy challenges data
const challenges = [
  { id: 'machine1', name: 'Web Server Exploitation', description: 'Exploit a vulnerable web server', link: 'http://challenge1.ctf.local', flag: 'flag{web_exp_2024}' },
  { id: 'machine2', name: 'SQL Injection Challenge', description: 'Find and exploit SQL injection vulnerability', link: 'http://challenge2.ctf.local', flag: 'flag{sql_master}' },
  { id: 'machine3', name: 'Buffer Overflow', description: 'Exploit buffer overflow to gain access', link: 'http://challenge3.ctf.local', flag: 'flag{buffer_pwned}' },
  { id: 'machine4', name: 'Cryptography Challenge', description: 'Decrypt the encrypted message', link: 'http://challenge4.ctf.local', flag: 'flag{crypto_solved}' },
  { id: 'machine5', name: 'Privilege Escalation', description: 'Escalate privileges to root', link: 'http://challenge5.ctf.local', flag: 'flag{root_access}' },
  { id: 'machine6', name: 'Reverse Engineering', description: 'Reverse engineer the binary', link: 'http://challenge6.ctf.local', flag: 'flag{reverse_eng}' },
];

// Get all challenges with solver information
const getChallenges = async () => {
  // Get all correct submissions
  const submissions = await ChallengeSubmission.find({ isCorrect: true }).populate('userId', 'username').sort({ solvedAt: 1 });
  
  // Group submissions by machineId and find the first solver
  const firstSolvers = new Map();
  submissions.forEach(sub => {
    if (!firstSolvers.has(sub.machineId)) {
      firstSolvers.set(sub.machineId, {
        username: (sub.userId as any).username,
        solvedAt: sub.solvedAt
      });
    }
  });
  
  // Map challenges with solver info
  const challengesWithSolvers = challenges.map(challenge => {
    const solver = firstSolvers.get(challenge.id);
    return {
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      link: challenge.link,
      firstSolver: solver ? {
        username: solver.username,
        solvedAt: solver.solvedAt
      } : null
    };
  });

  return challengesWithSolvers;
};

// Submit flag for a challenge
const submitFlag = async (user: IUser, machineId: string, flag: string) => {
  // Find the challenge
  const challenge = challenges.find(ch => ch.id === machineId);
  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  // Check if flag is correct
  const isCorrect = challenge.flag === flag.trim();

  if (!isCorrect) {
    return {
      success: false,
      message: "Invalid flag",
    };
  }

  // Check if already solved by someone (find first correct submission)
  const existingCorrectSubmission = await ChallengeSubmission.findOne({ machineId, isCorrect: true }).sort({ solvedAt: 1 }).populate('userId', 'username');
  const isFirstSolver = !existingCorrectSubmission;

  // Create new submission (only for correct flags)
  const submission = await ChallengeSubmission.create({
    userId: user._id,
    machineId,
    submittedFlag: flag.trim(),
    isCorrect,
  });

  if (isFirstSolver) {
    return {
      success: true,
      message: "Congratulations! You are the first to solve this challenge",
      isFirstSolver: true
    };
  } else {
    const firstSolver = existingCorrectSubmission.userId as any;
    return {
      success: true,
      message: `Flag is correct. This challenge was first solved by ${firstSolver.username}`,
      isFirstSolver: false,
      firstSolver: firstSolver.username
    };
  }
};

// Get user's solved machines count
const getUserStats = async (userId: string) => {
  const solvedCount = await ChallengeSubmission.countDocuments({ userId, isCorrect: true });
  const submissions = await ChallengeSubmission.find({ userId, isCorrect: true }).select('machineId solvedAt');
  
  return {
    totalSolved: solvedCount,
    solvedMachines: submissions.map(sub => ({
      machineId: sub.machineId,
      solvedAt: sub.solvedAt
    }))
  };
};

export {
  getChallenges,
  submitFlag,
  getUserStats,
};
