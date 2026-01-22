import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import AppError from "../utils/AppError.js";

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB
const MAX_FILES_PER_SUBMISSION = 10;

const parseCsvEnv = (value?: string) => {
  const raw = value?.trim();
  if (!raw) return null;
  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? new Set(items) : null;
};

const allowedMimeTypes = parseCsvEnv(process.env.UPLOAD_ALLOWED_MIME_TYPES);
const allowedExtensions = parseCsvEnv(process.env.UPLOAD_ALLOWED_EXTENSIONS);

const sanitizeSegment = (value: string) =>
  value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return cb(new AppError("Not authorized", 401) as any, "");
    }

    const rawChallengeId =
      (req.params as any)?.challengeId ?? (req.body as any)?.challengeId ?? "unknown";

    const challengeId = sanitizeSegment(String(rawChallengeId));
    const dest = path.join(
      process.cwd(),
      "uploads",
      "challenge-submissions",
      challengeId,
      userId
    );

    try {
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(new AppError("Failed to prepare upload directory", 500) as any, "");
    }
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).slice(0, 16);
    const safeExt = ext.replace(/[^.a-zA-Z0-9]/g, "");
    const random = crypto.randomBytes(12).toString("hex");
    cb(null, `${Date.now()}-${random}${safeExt}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (allowedMimeTypes && !allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new AppError(
        `Unsupported file type: ${file.mimetype}. Contact admin to allow it.`,
        400
      ) as any
    );
  }

  if (allowedExtensions) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return cb(
        new AppError(
          `Unsupported file extension: ${ext || "(none)"}. Contact admin to allow it.`,
          400
        ) as any
      );
    }
  }

  cb(null, true);
};

export const uploadChallengeSubmission = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_SUBMISSION,
  },
});

