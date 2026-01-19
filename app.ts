import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import errorHandler from "./middleware/errorHandler.ts";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import adminRoutes from "./routes/admin.ts";
import challengeRoutes from "./routes/challenges.ts";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";

// Load env vars
dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/challenges", challengeRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running...");
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
