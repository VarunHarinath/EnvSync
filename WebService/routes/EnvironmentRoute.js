import { Router } from "express";
import {
  createEnvironment,
  getEnvironmentsById,
  updateEnvironmentById,
  deleteEnvironmentById,
} from "../controllers/EnvironmentController.js";

const environmentRouter = Router();

environmentRouter.post("/", createEnvironment);
environmentRouter.get("/getEnvironmentById/:project_id", getEnvironmentsById);
environmentRouter.patch(
  "/updateEnvironmentById/:environment_id",
  updateEnvironmentById,
);
environmentRouter.delete(
  "/deleteEnvironmentById/:environment_id",
  deleteEnvironmentById,
);

export { environmentRouter };
