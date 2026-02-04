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

// Update Environment data by ID

const updateEnvironmentById = async (req, res, next) => {
  try {
    const { environment_id } = req.params;
    const { name } = req.body;
    const updateEnvironmentById = await envSyncService.updateEnvironmentById(
      environment_id,
      name,
    );
    successResponse(res, updateEnvironmentById, 202);
  } catch (e) {
    next(e);
  }
};

const deleteEnvironmentById = async (req, res, next) => {
  try {
    const { environment_id } = req.params;
    const deleteEnvironmentById =
      await envSyncService.deleteEnvironmentById(environment_id);
    successResponse(res, deleteEnvironmentById, 201);
  } catch (e) {
    next(e);
  }
};

export {
  createEnvironment,
  getEnvironmentsById,
  updateEnvironmentById,
  deleteEnvironmentById,
};
