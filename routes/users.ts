import express from "express";
const router = express.Router();
import userController from "../controllers/userController.ts";
import authenticate from "../middleware/authenticate.ts";
import authorize from "../middleware/authorize.ts";

// Get user profile by ID
router.get(
  "/profile/:id",
  authenticate,
  authorize("user", "admin"),
  userController.getUserProfile
);

// Search users (for team invites)
router.get(
  "/search",
  authenticate,
  authorize("user", "admin"),
  userController.searchUsers
);

export default router;
