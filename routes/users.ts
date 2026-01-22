import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

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

