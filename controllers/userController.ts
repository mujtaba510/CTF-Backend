import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.ts";
import * as userManager from "../managers/userManager.ts";
import { getUserProfileSchema } from "../schemaValidation/user.schema.ts";

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

export default { getUserProfile };
