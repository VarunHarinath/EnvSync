// Module imports...
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from "@clerk/express";
import { configDotenv } from "dotenv";

// Components imports...
import { homeRouter } from "./routes/HomeRoute.js";
import { projectRouter } from "./routes/ProjectRoute.js";
import { environmentRouter } from "./routes/EnvironmentRoute.js";
import { secretRouter } from "./routes/SecretRoute.js";
import { environmentSecretoute } from "./routes/EnvironmentSecretRoute.js";

// Dotenv Config
configDotenv();

// Serive Instance
const webService = express();

webService.use(express.json());
webService.use(cors());
webService.use(clerkMiddleware());

// Routes/controllers first
webService.use("/api/v1/environment_secret", environmentSecretoute);
webService.use("/api/v1/secret", secretRouter);
webService.use("/api/v1/environment", environmentRouter);
webService.use("/api/v1", homeRouter);
webService.use("/api/v1/project", projectRouter);

// Test Route For Clerk
webService.get("/user", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Debug route must be before error handlers
webService.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Sentry error handler AFTER routes/controllers
Sentry.setupExpressErrorHandler(webService);

// Global fallback error handler AFTER Sentry handler
webService.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    sentry: res.sentry ?? null,
  });
});

webService.listen(8080, () => {
  console.log("server is running on port 8080");
});
