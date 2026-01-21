import path from "path";
import ChallengeFileSubmission from "../models/ChallengeFileSubmission.ts";
import AppError from "../utils/AppError.ts";

const normalizeStoredPath = (absolutePath: string) => {
  const rel = path.relative(process.cwd(), absolutePath);
  return rel.split(path.sep).join("/");
};

const createSubmission = async (params: {
  userId: string;
  challengeId: string;
  files: Express.Multer.File[];
}) => {
  const { userId, challengeId, files } = params;

  if (!challengeId) {
    throw new AppError("Challenge ID is required", 400);
  }

  if (!files.length) {
    throw new AppError("At least one file is required", 400);
  }

  const existing = await ChallengeFileSubmission.findOne({ userId, challengeId })
    .select("_id")
    .lean();
  if (existing) {
    throw new AppError(
      "You already submitted files for this challenge. Only one submission is allowed per challenge.",
      400
    );
  }

  const submission = await ChallengeFileSubmission.create({
    userId,
    challengeId,
    files: files.map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      path: normalizeStoredPath(f.path),
      mimeType: f.mimetype,
      size: f.size,
    })),
    status: "pending",
  });

  return submission;
};

const getMySubmissionsForChallenge = async (params: {
  userId: string;
  challengeId: string;
}) => {
  const { userId, challengeId } = params;
  return ChallengeFileSubmission.find({ userId, challengeId })
    .sort({ createdAt: -1 })
    .lean();
};

export { createSubmission, getMySubmissionsForChallenge };
