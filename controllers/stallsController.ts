import { Request, Response } from "express";
import stallsManager from "../managers/stallsManager.js";
import type { CreateStallsSubmissionInput } from "../schemaValidation/stalls.schema.js";

class StallsController {
    /**
     * @route   POST /api/stalls
     * @desc    Create a new stalls submission
     * @access  Public
     */
    async createSubmission(req: Request, res: Response): Promise<void> {
        const data: CreateStallsSubmissionInput = req.body;

        const submission = await stallsManager.createSubmission(data);

        res.status(201).json({
            success: true,
            message: "Stalls submission created successfully",
            data: submission,
        });
    }

    /**
     * @route   GET /api/stalls
     * @desc    Get all stalls submissions
     * @access  Admin only
     */
    async getAllSubmissions(req: Request, res: Response): Promise<void> {
        const submissions = await stallsManager.getAllSubmissions();

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    }

    /**
     * @route   GET /api/stalls/:id
     * @desc    Get a single stalls submission by ID
     * @access  Admin only
     */
    async getSubmissionById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const submission = await stallsManager.getSubmissionById(id);

        res.status(200).json({
            success: true,
            data: submission,
        });
    }

    /**
     * @route   DELETE /api/stalls/:id
     * @desc    Delete a stalls submission
     * @access  Admin only
     */
    async deleteSubmission(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await stallsManager.deleteSubmission(id);

        res.status(200).json({
            success: true,
            message: "Stalls submission deleted successfully",
        });
    }
}

export default new StallsController();

