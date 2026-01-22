import StallsSubmission, { IStallsSubmission } from "../models/StallsSubmission.js";
import AppError from "../utils/AppError.js";
import type { CreateStallsSubmissionInput } from "../schemaValidation/stalls.schema.js";

class StallsManager {
    /**
     * Create a new stalls submission
     */
    async createSubmission(
        data: CreateStallsSubmissionInput
    ): Promise<IStallsSubmission> {
        try {
            // Check if email already submitted
            const existingSubmission = await StallsSubmission.findOne({
                email: data.email,
            });

            if (existingSubmission) {
                throw new AppError(
                    "A submission with this email already exists",
                    400
                );
            }

            // Create new submission
            const submission = await StallsSubmission.create(data);

            return submission;
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                error.message || "Error creating stalls submission",
                500
            );
        }
    }

    /**
     * Get all stalls submissions (Admin only)
     */
    async getAllSubmissions(): Promise<IStallsSubmission[]> {
        try {
            const submissions = await StallsSubmission.find().sort({
                submissionDate: -1,
            });

            return submissions;
        } catch (error: any) {
            throw new AppError(
                error.message || "Error fetching stalls submissions",
                500
            );
        }
    }

    /**
     * Get a single stalls submission by ID
     */
    async getSubmissionById(id: string): Promise<IStallsSubmission> {
        try {
            const submission = await StallsSubmission.findById(id);

            if (!submission) {
                throw new AppError("Stalls submission not found", 404);
            }

            return submission;
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                error.message || "Error fetching stalls submission",
                500
            );
        }
    }

    /**
     * Delete a stalls submission by ID (Admin only)
     */
    async deleteSubmission(id: string): Promise<void> {
        try {
            const submission = await StallsSubmission.findByIdAndDelete(id);

            if (!submission) {
                throw new AppError("Stalls submission not found", 404);
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                error.message || "Error deleting stalls submission",
                500
            );
        }
    }
}

export default new StallsManager();

