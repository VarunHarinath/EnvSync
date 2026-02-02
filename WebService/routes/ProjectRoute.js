import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectNameById,
  deleteProjectById,
} from "../controllers/ProjectController.js";

const projectRouter = Router();

projectRouter.post("/", createProject);
projectRouter.get("/getProjects", getProjects);
projectRouter.get("/getProjectById/:project_id", getProjectById);
projectRouter.patch("/updateProjectById/:project_id", updateProjectNameById);
projectRouter.delete("/deleteproject/:project_id", deleteProjectById);

export { projectRouter };
