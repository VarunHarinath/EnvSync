import { Router } from "express";
import {
  createEnvironmentSecret,
  getEnvironmentSecretsById,
  updateEnvironmentSecretById,
  deleteEnvironmentSecretById,
} from "../controllers/EnvironmentSecretController.js";

const environmentSecretoute = Router();

environmentSecretoute.post("/", createEnvironmentSecret);
environmentSecretoute.get(
  "/getEnvironmentSecretsById/:environment_secret_id",
  getEnvironmentSecretsById,
);
environmentSecretoute.patch(
  "/updateEnvironmentSecretById/:environment_secret_id",
  updateEnvironmentSecretById,
);
environmentSecretoute.delete(
  "/deleteEnvironmentSecretById/:environment_secret_id",
  deleteEnvironmentSecretById,
);

export { environmentSecretoute };
