import { Router } from "express";
import { createProject } from "../controllers/ProjectController.js";

const projectRouter = Router();

projectRouter.post("/", createProject);

export { projectRouter };
