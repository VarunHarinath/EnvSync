import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createSecret = async (req, res, next) => {
  try {
    const { project_id, secretName, secretValue } = req.body;

    const result = await envSyncService.newSecret(
      project_id, 
      secretName, 
      secretValue
    );
    successResponse(res, result, 201);
  } catch (e) {
    next(e);
  }
};
// get secrets based on project Id
const getSecretsByProjectId = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const getSecretsByProjectId =
      await envSyncService.getSecretsByProjectId(project_id);
    successResponse(res, getSecretsByProjectId, 200);
  } catch (e) {
    next(e);
  }
};

// Get secret & Secret Values based on the secret_id

const getSecretsBySecretId = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const result =
      await envSyncService.getSecretsById(secret_id);
    successResponse(res, result, 200);
  } catch (e) {
    next(e);
  }
};

// Update Secret's by secret_id

const updateSecretById = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const { name, value } = req.body;
    const result = await envSyncService.updateSecretById(
      secret_id,
      name,
      value,
    );
    successResponse(res, result, 201);
  } catch (e) {
    next(e);
  }
};

const deleteSecretById = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const result = await envSyncService.deleteSecretById(secret_id);
    successResponse(res, result, 201);
  } catch (e) {
    next(e);
  }
};

export {
  createSecret,
  getSecretsByProjectId,
  getSecretsBySecretId,
  updateSecretById,
  deleteSecretById,
};
