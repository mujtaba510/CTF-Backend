import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as userManager from "../managers/userManager.js";
import { getUserProfileSchema } from "../schemaValidation/user.schema.js";

// Get user profile by ID
/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Profile not found
 */
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = getUserProfileSchema.parse(req.params);
    const result = await userManager.getUserProfile(validated.id, req.user);
    res.status(200).json(result);
  }
);

export const searchUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const q = (req.query.q as string) || "";
    const result = await userManager.searchUsers(q, req.user);
    res.status(200).json(result);
  }
);

export default { getUserProfile, searchUsers };

