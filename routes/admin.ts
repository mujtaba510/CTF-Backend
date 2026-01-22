import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

// Get paginated users (admin only)
router.get(
  "/users",
  authenticate,
  authorize("admin", "user"),
  adminController.getUsers
);

// Delete user by ID (admin only)
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.deleteUser
);

export default router;

