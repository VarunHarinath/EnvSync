import { Router } from "express";
import { createEnvironment } from "../controllers/EnvironmentController.js";

const environmentRouter = Router();

environmentRouter.post("/", createEnvironment);

export { environmentRouter };
