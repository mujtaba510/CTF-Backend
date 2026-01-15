import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.ts";

// Pass a Zod schema to this middleware
const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError && err.issues.length > 0) {
        return next(new AppError(err.issues[0].message, 400));
      }
      return next(new AppError("Validation error", 400));
    }
  };

export default validate;
