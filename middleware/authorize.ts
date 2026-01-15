import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.ts";

// Usage: authorize('admin'), authorize('analyst'), authorize('admin', 'analyst')
const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Not authorized for this resource", 403);
    }
    next();
  };
};

export default authorize;
