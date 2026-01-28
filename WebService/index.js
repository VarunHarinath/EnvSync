import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { homeRouter } from "./routes/HomeRoute.js";
import { projectRouter } from "./routes/ProjectRoute.js";
import { environmentRouter } from "./routes/EnvironmentRoute.js";
import { secretRouter } from "./routes/SecretRoute.js";
import { environmentSecretoute } from "./routes/EnvironmentSecretRoute.js";

const webService = express();

webService.use(express.json());
webService.use(cors());

// Routes/controllers first
webService.use("/api/v1/environment_secret", environmentSecretoute);
webService.use("/api/v1/secret", secretRouter);
webService.use("/api/v1/environment", environmentRouter);
webService.use("/api/v1", homeRouter);
webService.use("/api/v1/project", projectRouter);

// Debug route must be before error handlers
webService.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Sentry error handler AFTER routes/controllers
Sentry.setupExpressErrorHandler(webService);

// Optional fallback error handler AFTER Sentry handler
webService.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    sentry: res.sentry ?? null,
  });
});

webService.listen(8080, () => {
  console.log("server is running on port 8080");
});
