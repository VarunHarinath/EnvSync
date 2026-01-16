import { Router } from "express";
import { createEnvironmentSecret } from "../controllers/EnvironmentSecretController.js";

const environmentSecretoute = Router();

environmentSecretoute.post("/", createEnvironmentSecret);

export { environmentSecretoute };
