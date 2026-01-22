import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as adminManager from "../managers/adminManager.js";
import {
  getUsersQuerySchema,
  deleteUserSchema,
} from "../schemaValidation/admin.schema.js";

// Get paginated users
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       isVerified:
 *                         type: boolean
 *                       role:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   example: 5000
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized
 */
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = getUsersQuerySchema.parse(req.query);
    const result = await adminManager.getUsers(validated.page, validated.limit);
    res.json(result);
  }
);

// Delete user by ID (admin only)
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Only admins can delete users
 *       404:
 *         description: User not found
 */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = deleteUserSchema.parse(req.params);
    const result = await adminManager.deleteUser(validated.id, req.user);
    res.status(200).json(result);
  }
);

export default { getUsers, deleteUser };

