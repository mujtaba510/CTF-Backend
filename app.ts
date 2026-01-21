import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import errorHandler from "./middleware/errorHandler.ts";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import adminRoutes from "./routes/admin.ts";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";
import mongoose from "mongoose";

// Load env vars
dotenv.config();

const HOST = (process.env.HOST ?? "127.0.0.1").trim();
const PORT = Number(process.env.PORT ?? 5000);
const app = express();

// When behind nginx / reverse proxies (common in production hosting)
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests like curl/same-origin may not include Origin
      if (!origin) return callback(null, true);

      // If no allow-list is configured, allow all origins (useful for internal setups)
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Connect to DB
connectDB();

// Routes
const requireDb = (req: Request, res: Response, next: NextFunction) => {
  // Always allow CORS preflight
  if (req.method === "OPTIONS") return next();

  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: "fail",
      message: "Database unavailable. Please try again in a moment.",
    });
  }

  return next();
};

app.use("/api/auth", requireDb, authRoutes);
app.use("/api/users", requireDb, userRoutes);
app.use("/api/admin", requireDb, adminRoutes);

// Health (useful for nginx / uptime checks)
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mongo: {
      readyState: mongoose.connection.readyState,
      readyStateLabel:
        mongoose.connection.readyState === 0
          ? "disconnected"
          : mongoose.connection.readyState === 1
            ? "connected"
            : mongoose.connection.readyState === 2
              ? "connecting"
              : "disconnecting",
    },
  });
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running...");
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
