import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.ts";
import authenticate from "../middleware/authenticate.ts";
import authorize from "../middleware/authorize.ts";

// Get paginated users (admin only)
router.get(
  "/users",
  authenticate,
  authorize("admin", "user"),
  adminController.getUsers
);

// Get user detail by ID (admin only)
router.get(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.getUserDetail
);

// Delete user by ID (admin only)
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.deleteUser
);

// Get paginated challenge submissions (CTF Machines)
router.get(
  "/challenge-submissions",
  authenticate,
  authorize("admin"),
  adminController.getChallengeSubmissions
);

// Get paginated file submissions (CTF Challenges)
router.get(
  "/file-submissions",
  authenticate,
  authorize("admin"),
  adminController.getFileSubmissions
);

// Download challenge file (admin only)
router.get(
  "/download",
  authenticate,
  authorize("admin"),
  adminController.downloadChallengeFile
);

// Get team leaderboard (admin only)
router.get(
  "/leaderboard",
  authenticate,
  authorize("admin"),
  adminController.getTeamLeaderboard
);

export default router;
