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

// Delete user by ID (admin only)
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.deleteUser
);

export default router;
