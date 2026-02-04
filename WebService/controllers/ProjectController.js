import { envSyncService } from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createProject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await envSyncService.newProject(name);
    successResponse(res, result, 201);
  } catch (e) {
    next(e);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const result = await envSyncService.getProject();
    successResponse(res, result);
  } catch (e) {
    next(e);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { project_id } = req.params;

    const result = await envSyncService.getProjectById(project_id);
    successResponse(res, result);
  } catch (e) {
    next(e);
  }
};

const updateProjectNameById = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { name } = req.body;

    const result = await envSyncService.updateProjectNameById(project_id, name);
    successResponse(res, result, 202);
  } catch (e) {
    next(e);
  }
};

const deleteProjectById = async (req, res, next) => {
  try {
    const { project_id } = req.params;

    const result = await envSyncService.deleteProjectById(project_id);
    successResponse(res, result, 202);
  } catch (e) {
    next(e);
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProjectNameById,
  deleteProjectById,
};
