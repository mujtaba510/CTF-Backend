import express from "express";
const router = express.Router();
import challengeController from "../controllers/challengeController.ts";
import authenticate from "../middleware/authenticate.ts";
import authorize from "../middleware/authorize.ts";

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

export default router;
