import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.ts";
import * as challengeManager from "../managers/challengeManager.ts";
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
    const challenges = await challengeManager.getChallenges();
    return res.status(200).json({ success: true, challenges });
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
 *         description: Incorrect flag or already solved
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

export default {
  getChallenges,
  submitFlag,
  getUserStats,
};
