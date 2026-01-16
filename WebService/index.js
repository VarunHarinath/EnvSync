import express from "express";
import { homeRouter } from "./routes/HomeRoute.js";
import { projectRouter } from "./routes/ProjectRoute.js";
import { environmentRouter } from "./routes/EnvironmentRoute.js";
import { secretRouter } from "./routes/SecretRoute.js";
import { environmentSecretoute } from "./routes/EnvironmentSecretRoute.js";
import cors from "cors";

const webService = express();

webService.use(express.json());
webService.use(cors());

webService.use("/api/v1/environment_secret", environmentSecretoute);
webService.use("/api/v1/secret", secretRouter);
webService.use("/api/v1/environment", environmentRouter);
webService.use("/api/v1", homeRouter);
webService.use("/api/v1/project", projectRouter);

webService.listen(8080, () => {
  console.log("server is runing on port 8080");
});
