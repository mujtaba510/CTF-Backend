import express from "express";
const router = express.Router();
import challengeController from "../controllers/challengeController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { uploadChallengeSubmission } from "../middleware/uploadChallengeSubmission.js";

// Get all challenges with solver info
router.get(
  "/",
  authenticate,
  authorize("user", "admin"),
  challengeController.getChallenges
);

// Submit flag
router.post(
  "/submit",
  authenticate,
  authorize("user", "admin"),
  challengeController.submitFlag
);

// Get user stats
router.get(
  "/stats",
  authenticate,
  authorize("user", "admin"),
  challengeController.getUserStats
);

// Get user's solved challenges
router.get(
  "/solved",
  authenticate,
  authorize("user", "admin"),
  challengeController.getUserSolvedChallenges
);

// Submit challenge files (multipart/form-data)
router.post(
  "/:challengeId/submissions",
  authenticate,
  authorize("user", "admin"),
  uploadChallengeSubmission.array("files", 10),
  challengeController.submitChallengeFiles
);

// Get current user's submissions for a given challenge
router.get(
  "/:challengeId/submissions/me",
  authenticate,
  authorize("user", "admin"),
  challengeController.getMyChallengeSubmissions
);

export default router;

