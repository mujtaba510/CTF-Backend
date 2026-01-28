import express from "express";
import path from "path";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import challengeRoutes from "./routes/challenges.js";
import teamRoutes from "./routes/teams.js";
import stallsRoutes from "./routes/stalls.js";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import mongoose from "mongoose";

// Load env vars
dotenv.config();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 5000;
const app = express();

// When behind nginx / reverse proxies (common in production hosting)
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use((req, res, next) => {
  const originHeader = req.headers.origin;
  if (!originHeader) return next();

  const normalizedOrigin = normalizeOrigin(String(originHeader));
  const isAllowed =
    allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin);

  if (!isAllowed) return next();

  // Echo the request Origin exactly (required for credentials).
  res.setHeader("Access-Control-Allow-Origin", String(originHeader));
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  const requestedHeaders = req.headers["access-control-request-headers"];
  res.setHeader(
    "Access-Control-Allow-Headers",
    requestedHeaders ? String(requestedHeaders) : "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }

  return next();
});
// Connect to DB
connectDB();
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

// Serve uploads folder as static files for downloads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);


app.use("/api/auth", requireDb, authRoutes);
app.use("/api/users", requireDb, userRoutes);
app.use("/api/admin", requireDb, adminRoutes);
app.use("/api/stalls", requireDb, stallsRoutes);

app.use("/api/challenges", challengeRoutes);
app.use("/api/teams", teamRoutes);

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

app.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`),
);
