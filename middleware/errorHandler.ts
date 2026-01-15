import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
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
