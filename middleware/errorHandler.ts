import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import AppError from "../utils/AppError.ts";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err }; // copy error
  error.message = err.message;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    error.statusCode = 400;
    error.status = "fail";
    error.message = err.issues[0].message; // First error message
  }
  // Handle Multer upload errors
  else if (err instanceof multer.MulterError) {
    error.statusCode = 400;
    error.status = "fail";

    if (err.code === "LIMIT_FILE_SIZE") {
      error.statusCode = 413;
      error.message = "File too large. Maximum allowed size is 500MB.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      error.message = "Too many files uploaded.";
    } else {
      error.message = err.message;
    }
  }
  // Handle known errors (AppError)
  else if (!(err instanceof AppError)) {
    // Unknown / programming error
    error.statusCode = 500;
    error.status = "error";
    error.message = "Internal Server Error";
    console.error(err); // log the full error stack for debugging
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default errorHandler;
