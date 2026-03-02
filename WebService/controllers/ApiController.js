import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const newApiController = async (req, res, next) => {
  try {
    const { project_id, environment_id, key_hash, key_prefix } = req.body;
    const newApi = await envSyncService.newApi(
      project_id,
      environment_id,
      key_hash,
      key_prefix,
    );
    successResponse(res, newApi, 200);
  } catch (e) {
    next(e);
  }
};

const getApiKeysByProjectId = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const apiKeys = await envSyncService.getApiKeysByProjectId(project_id);
    successResponse(res, apiKeys, 200);
  } catch (e) {
    next(e);
  }
};

const deleteApiKeyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await envSyncService.deleteApiKeyById(id);
    successResponse(res, result, 200);
  } catch (e) {
    next(e);
  }
};

export { newApiController, getApiKeysByProjectId, deleteApiKeyById };
