import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.ts";
import * as challengeManager from "../managers/challengeManager.ts";
import * as challengeFileSubmissionManager from "../managers/challengeFileSubmissionManager.ts";
import AppError from "../utils/AppError.ts";

// Get all challenges
/**
 * @swagger
 * /api/challenges:
 *   get:
 *     summary: Get all challenges with solver information
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Challenges retrieved successfully
 */
const getChallenges = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await challengeManager.getChallenges(req.user._id.toString());
    return res.status(200).json({ success: true, ...data });
  }
);

// Submit flag
/**
 * @swagger
 * /api/challenges/submit:
 *   post:
 *     summary: Submit flag for a challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machineId:
 *                 type: string
 *               flag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flag accepted
 *       400:
 *         description: Incorrect flag
 */
const submitFlag = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { machineId, flag } = req.body;
    if (!machineId || !flag) {
      throw new AppError("Machine ID and flag are required", 400);
    }
    const result = await challengeManager.submitFlag(req.user, machineId, flag);
    return res.status(200).json(result);
  }
);

// Get user stats
/**
 * @swagger
 * /api/challenges/stats:
 *   get:
 *     summary: Get user's solved challenges stats
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 */
const getUserStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await challengeManager.getUserStats(req.user._id.toString());
    return res.status(200).json({ success: true, stats });
  }
);

// Get user's solved challenges
/**
 * @swagger
 * /api/challenges/solved:
 *   get:
 *     summary: Get list of challenges solved by the user
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's solved challenges retrieved successfully
 */
const getUserSolvedChallenges = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const solvedChallenges = await challengeManager.getUserSolvedChallenges(req.user._id.toString());
    return res.status(200).json({ success: true, solvedChallenges });
  }
);

// Submit challenge files
const submitChallengeFiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const challengeId = req.params.challengeId;
    if (!challengeId) {
      throw new AppError("Challenge ID is required", 400);
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (!files.length) {
      throw new AppError("Please upload at least one file", 400);
    }

    const submission = await challengeFileSubmissionManager.createSubmission({
      userId: req.user._id.toString(),
      challengeId,
      files,
    });

    return res.status(201).json({ success: true, submission });
  }
);

// Get current user's submissions for a challenge
const getMyChallengeSubmissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const challengeId = req.params.challengeId;
    if (!challengeId) {
      throw new AppError("Challenge ID is required", 400);
    }

    const submissions = await challengeFileSubmissionManager.getMySubmissionsForChallenge({
      userId: req.user._id.toString(),
      challengeId,
    });

    return res.status(200).json({ success: true, submissions });
  }
);

// View a hint for a challenge
/**
 * @swagger
 * /api/challenges/hint:
 *   post:
 *     summary: View a hint for a challenge (deducts points)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machineId:
 *                 type: string
 *               hintNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Hint revealed successfully
 *       400:
 *         description: Invalid request or hint already viewed
 */
const viewHint = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { machineId, hintNumber } = req.body;
    if (!machineId || !hintNumber) {
      throw new AppError("Machine ID and hint number are required", 400);
    }
    const result = await challengeManager.viewHint(req.user, machineId, hintNumber);
    return res.status(200).json(result);
  }
);

export default {
  getChallenges,
  submitFlag,
  getUserStats,
  getUserSolvedChallenges,
  submitChallengeFiles,
  getMyChallengeSubmissions,
  viewHint,
};
