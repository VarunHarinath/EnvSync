import { Router } from "express";
import {
  createEnvironmentSecret,
  getEnvironmentSecretsById,
  updateEnvironmentSecretById,
  deleteEnvironmentSecretById,
} from "../controllers/EnvironmentSecretController.js";

const environmentSecretRoute = Router();

environmentSecretRoute.post("/", createEnvironmentSecret);
environmentSecretRoute.get(
  "/getEnvironmentSecretsById/:environment_id",
  getEnvironmentSecretsById,
);
environmentSecretRoute.patch(
  "/updateEnvironmentSecretById/:environment_secret_id",
  updateEnvironmentSecretById,
);
environmentSecretRoute.delete(
  "/deleteEnvironmentSecretById/:environment_secret_id",
  deleteEnvironmentSecretById,
);

export { environmentSecretRoute };
