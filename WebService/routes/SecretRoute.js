import { Router } from "express";
import {
  createSecret,
  getSecretsByProjectId,
  updateSecrectById,
  deleteSecrectById,
} from "../controllers/SecretController.js";

const secretRouter = Router();

secretRouter.post("/", createSecret);
secretRouter.get("/getSecrectsByProjectId/:project_id", getSecretsByProjectId);
secretRouter.patch("/updateSecretsBySecretId/:secret_id", updateSecrectById);
secretRouter.delete("/deleteSecretBySecretId/:secret_id", deleteSecrectById);

export { secretRouter };
