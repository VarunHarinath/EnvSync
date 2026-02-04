import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createEnvironment = async (req, res, next) => {
  try {
    const { environmentName, project_id } = req.body;

    const createEnvironment = await envSyncService.newEnvironment(
      project_id,
      environmentName,
    );
    successResponse(res, createEnvironment, 201);
  } catch (e) {
    next(e);
  }
};

// Get Environment by Id

const getEnvironmentsById = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const getEnvironmentsById =
      await envSyncService.getEnvironmentsById(project_id);
    successResponse(res, getEnvironmentsById, 200);
  } catch (e) {
    next(e);
  }
};

export { createEnvironment, getEnvironmentsById };
