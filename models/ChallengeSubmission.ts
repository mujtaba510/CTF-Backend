import mongoose, { Document } from 'mongoose';

export interface IChallengeSubmission extends Document {
    userId: mongoose.Types.ObjectId;
    machineId: string;
    submittedFlag: string;
    isCorrect: boolean;
    solvedAt: Date;
}

const challengeSubmissionSchema = new mongoose.Schema<IChallengeSubmission>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    machineId: { type: String, required: true },
    submittedFlag: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    solvedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Ensure only one submission per machine (first solver wins)
// challengeSubmissionSchema.index({ machineId: 1 }, { unique: true });

export default mongoose.model<IChallengeSubmission>('ChallengeSubmission', challengeSubmissionSchema);

