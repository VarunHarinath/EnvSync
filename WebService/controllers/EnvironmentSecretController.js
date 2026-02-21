import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

// Creating environment secret
const createEnvironmentSecret = async (req, res, next) => {
  try {
    const { environment_id, secret_id } = req.body;

    const createEnvironmentSecret = await envSyncService.newEnvironmentSecret(
      environment_id,
      secret_id,
    );
    successResponse(res, createEnvironmentSecret, 200);
  } catch (e) {
    next(e);
  }
};

// Getting data from the environment secret table using it's ID

const getEnvironmentSecretsById = async (req, res, next) => {
  try {
    const { environment_id } = req.params;
    const getEnvironmentSecretsById =
      await envSyncService.getEnvironmentSecretsById(environment_id);
    successResponse(res, getEnvironmentSecretsById, 200);
  } catch (e) {
    next(e);
  }
};

// Update the environment ecret using it's id

const updateEnvironmentSecretById = async (req, res, next) => {
  try {
    const { environment_id, secret_id } = req.body;
    const { environment_secret_id } = req.params;
    const updateEnvironmentSecretById =
      await envSyncService.updateEnvironmentSecretById(
        environment_secret_id,
        environment_id,
        secret_id,
      );
    successResponse(res, updateEnvironmentSecretById, 202);
  } catch (e) {
    next(e);
  }
};

// Delete the Environment Secrect Based on it's ID

const deleteEnvironmentSecretById = async (req, res, next) => {
  try {
    const { environment_secret_id } = req.params;
    const deleteEnvironmentSecretById =
      await envSyncService.deleteEnvironmentSecretById(environment_secret_id);
    successResponse(res, deleteEnvironmentSecretById, 201);
  } catch (e) {
    next(e);
  }
};

export {
  createEnvironmentSecret,
  getEnvironmentSecretsById,
  updateEnvironmentSecretById,
  deleteEnvironmentSecretById,
};
