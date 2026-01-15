import { Router } from "express";
import { homeController } from "../controllers/HomeController.js";

const homeRouter = Router();

homeRouter.get("/", homeController);

export { homeRouter };
