import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Not authorized, token missing", 401);
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      res.clearCookie("token");
      throw new AppError("Not authorized, token failed", 401);
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }
    req.user = user;
    // console.log("Authenticated user:", req.user);
    next();
  }
);

export default authenticate;

