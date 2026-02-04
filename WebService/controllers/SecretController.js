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

const getSecrets = async (req, res, next) => {
  try {
    pass;
  } catch (e) {
    next(e);
  }
};

export { createSecret };
