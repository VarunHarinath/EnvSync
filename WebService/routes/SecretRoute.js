import { Router } from "express";
import {
  createSecret,
  getSecretsByProjectId,
  getSecretsBySecretId,
  updateSecretById,
  deleteSecretById,
} from "../controllers/SecretController.js";

const secretRouter = Router();

secretRouter.post("/", createSecret);
secretRouter.get("/getSecretsByProjectId/:project_id", getSecretsByProjectId);
secretRouter.get("/getSecretsBySecretId/:secret_id", getSecretsBySecretId);
secretRouter.patch("/updateSecretsBySecretId/:secret_id", updateSecretById);
secretRouter.delete("/deleteSecretBySecretId/:secret_id", deleteSecretById);

export { secretRouter };
