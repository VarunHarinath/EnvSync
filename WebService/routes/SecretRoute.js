import { Router } from "express";
import { createSecret } from "../controllers/SecretController.js";

const secretRouter = Router();

secretRouter.post("/", createSecret);

export { secretRouter };
