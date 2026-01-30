import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
} from "../controllers/ProjectController.js";

const projectRouter = Router();

projectRouter.post("/", createProject);
projectRouter.get("/getProjects", getProjects);
projectRouter.get("/getProjectById/:project_id", getProjectById);

export { projectRouter };
