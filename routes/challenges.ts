import express from "express";
const router = express.Router();
import challengeController from "../controllers/challengeController.ts";
import authenticate from "../middleware/authenticate.ts";
import authorize from "../middleware/authorize.ts";
import { uploadChallengeSubmission } from "../middleware/uploadChallengeSubmission.ts";

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

// View a hint (deducts points from team)
router.post(
  "/hint",
  authenticate,
  authorize("user", "admin"),
  challengeController.viewHint
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
