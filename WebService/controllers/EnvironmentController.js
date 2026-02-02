import EnvSyncService from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createEnvironment = async (req, res) => {
  try {
    const { environmentName, project_id } = req.body;
    const envSyncService = new EnvSyncService();
    const createEnvironment = await envSyncService.newEnvironment(
      project_id,
      environmentName,
    );
    successResponse(res, createEnvironment, 201);
  } catch (e) {
    next(e);
  }
};

export { createEnvironment };
