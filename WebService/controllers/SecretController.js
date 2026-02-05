import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createSecret = async (req, res, next) => {
  try {
    const { project_id, secretName, secretValue } = req.body;

    const createSecret = await envSyncService.newSecret(project_id, secretName);
    const createSecretValue = await envSyncService.newSecretValue(
      createSecret.id,
      secretValue,
    );
    successResponse(res, createSecretValue, 201);
  } catch (e) {
    next(e);
  }
};
// get secrects based on project Id
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

// Get secrect & Secrect Values based on the secrect_id

const getSecretsBySecrectId = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const getSecretsBySecrectId =
      await envSyncService.getSecretsById(secret_id);
    successResponse(res, getSecretsBySecrectId, 200);
  } catch (e) {
    next(e);
  }
};

// Update Secrect's by secret_id

const updateSecrectById = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const { name, value } = req.body;
    const updateSecrectById = await envSyncService.updateSecrectById(
      secret_id,
      name,
      value,
    );
    successResponse(res, updateSecrectById, 201);
  } catch (e) {
    next(e);
  }
};

const deleteSecrectById = async (req, res, next) => {
  try {
    const { secret_id } = req.params;
    const deleteSecrectById = await envSyncService.deleteSecrectById(secret_id);
    successResponse(res, deleteSecrectById, 201);
  } catch (e) {
    next(e);
  }
};

export {
  createSecret,
  getSecretsByProjectId,
  getSecretsBySecrectId,
  updateSecrectById,
  deleteSecrectById,
};
