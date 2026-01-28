import { Router } from "express";
import stallsController from "../controllers/stallsController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import validate from "../middleware/validate.js";
import { createStallsSubmissionSchema } from "../schemaValidation/stalls.schema.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();

/**
 * @swagger
 * /api/stalls:
 *   post:
 *     summary: Create a new stalls submission
 *     tags: [Stalls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - companyOrUniversity
 *               - productName
 *               - productDescription
 *               - phoneNumber
 *               - teamMembers
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               companyOrUniversity:
 *                 type: string
 *               productName:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               teamMembers:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stalls submission created successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post(
    "/",
    validate(createStallsSubmissionSchema),
    asyncHandler(stallsController.createSubmission)
);

/**
 * @swagger
 * /api/stalls:
 *   get:
 *     summary: Get all stalls submissions (Admin only)
 *     tags: [Stalls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stalls submissions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get(
    "/",
    authenticate,
    authorize("admin"),
    asyncHandler(stallsController.getAllSubmissions)
);

/**
 * @swagger
 * /api/stalls/{id}:
 *   get:
 *     summary: Get a single stalls submission by ID (Admin only)
 *     tags: [Stalls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stalls submission ID
 *     responses:
 *       200:
 *         description: Stalls submission details
 *       404:
 *         description: Stalls submission not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get(
    "/:id",
    authenticate,
    authorize("admin"),
    asyncHandler(stallsController.getSubmissionById)
);

/**
 * @swagger
 * /api/stalls/{id}:
 *   delete:
 *     summary: Delete a stalls submission (Admin only)
 *     tags: [Stalls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stalls submission ID
 *     responses:
 *       200:
 *         description: Stalls submission deleted successfully
 *       404:
 *         description: Stalls submission not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    asyncHandler(stallsController.deleteSubmission)
);

export default router;

