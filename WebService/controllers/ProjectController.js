import EnvSyncService from "../Services/EnvSyncService.js";
import { successResponse } from "../model/SuccessResponseModel.js";

const createProject = async (req, res) => {
  try {
    const envSyncService = new EnvSyncService();
    const { name } = req.body;
    const result = await envSyncService.newProject(name);
    successResponse(res, result, 201);
  } catch (e) {
    next(e);
  }
};

const getProjects = async (req, res) => {
  try {
    const envSyncService = new EnvSyncService();
    const result = await envSyncService.getProject();
    successResponse(res, result);
  } catch (e) {
    next(e);
  }
};

const getProjectById = async (req, res) => {
  try {
    const { project_id } = req.params;
    const envSyncService = new EnvSyncService();
    const result = await envSyncService.getProjectById(project_id);
    successResponse(res, result);
  } catch (e) {
    next(e);
  }
};

const updateProjectNameById = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { name } = req.body;
    const envSyncService = new EnvSyncService();
    const result = await envSyncService.updateProjectNameById(project_id, name);
    successResponse(res, result, 202);
  } catch (e) {
    next(e);
  }
};

const deleteProjectById = async (req, res) => {
  try {
    const { project_id } = req.params;
    const envSyncService = new EnvSyncService();
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
