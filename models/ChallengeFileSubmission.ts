import mongoose, { Document } from "mongoose";

export type SubmissionStatus = "pending" | "accepted" | "rejected";

export interface ISubmissionFile {
  originalName: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
}

export interface IChallengeFileSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: string;
  files: ISubmissionFile[];
  status: SubmissionStatus;
  submittedAt: Date;
}

const submissionFileSchema = new mongoose.Schema<ISubmissionFile>(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const challengeFileSubmissionSchema = new mongoose.Schema<IChallengeFileSubmission>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: String, required: true },
    files: { type: [submissionFileSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

challengeFileSubmissionSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export default mongoose.model<IChallengeFileSubmission>(
  "ChallengeFileSubmission",
  challengeFileSubmissionSchema
);

