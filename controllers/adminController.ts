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
    const search = req.query.search as string | undefined;
    const result = await adminManager.getUsers(validated.page, validated.limit, search);
    res.json(result);
  }
);

// Get user detail (admin only)
/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details with team and submissions
 *     tags: [Admin]
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
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
export const getUserDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await adminManager.getUserDetail(id);
    res.json(result);
  }
);

// Get paginated challenge submissions (CTF Machines)
export const getChallengeSubmissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = getUsersQuerySchema.parse(req.query);
    const search = req.query.search as string | undefined;
    const result = await adminManager.getChallengeSubmissions(validated.page, validated.limit, search);
    res.json(result);
  }
);

// Get paginated file submissions (CTF Challenges)
export const getFileSubmissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = getUsersQuerySchema.parse(req.query);
    const search = req.query.search as string | undefined;
    const result = await adminManager.getFileSubmissions(validated.page, validated.limit, search);
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

<<<<<<< HEAD
// Download challenge file
export const downloadChallengeFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.query.path as string;
    if (!filePath) {
      res.status(400).json({ message: "File path is required" });
      return;
    }
    const decodedPath = decodeURIComponent(filePath);
    const fullPath = `${process.cwd()}/${decodedPath}`;
    
    res.download(fullPath, (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  }
);

// Get team leaderboard
/**
 * @swagger
 * /api/admin/leaderboard:
 *   get:
 *     summary: Get team leaderboard sorted by points
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team leaderboard retrieved successfully
 */
export const getTeamLeaderboard = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const leaderboard = await adminManager.getTeamLeaderboard();
    res.json({ success: true, leaderboard });
  }
);

export default {
  getUsers,
  getUserDetail,
  getChallengeSubmissions,
  getFileSubmissions,
  deleteUser,
  downloadChallengeFile,
  getTeamLeaderboard,
};
=======
export default { getUsers, deleteUser };

>>>>>>> c88ab55bbcc333c38255d9416fce02fe67ac52fd
