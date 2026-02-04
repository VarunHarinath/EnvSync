import { Router } from "express";
import {
  createEnvironment,
  getEnvironmentsById,
} from "../controllers/EnvironmentController.js";

const environmentRouter = Router();

environmentRouter.post("/", createEnvironment);
environmentRouter.get("/getEnvironmentById/:project_id", getEnvironmentsById);

export { environmentRouter };
