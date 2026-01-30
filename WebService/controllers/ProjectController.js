import EnvSyncService from "../Services/EnvSyncService.js";

const createProject = async (req, res) => {
  try {
    const envSyncService = new EnvSyncService();
    const { name } = req.body;
    const result = await envSyncService.newProject(name);
    res.json(result);
  } catch (e) {
    throw e;
  }
};

const getProjects = async (req, res) => {
  try {
    const envSyncService = new EnvSyncService();
    const result = await envSyncService.getProject();
    res.json(result);
  } catch (e) {
    throw e;
  }
};

const getProjectById = async (req, res) => {
  try {
    const { project_id } = req.params;
    const envSyncService = new EnvSyncService();
    const result = await envSyncService.getProjectById(project_id);
    res.json(result);
  } catch (e) {
    throw e;
  }
};

export { createProject, getProjects, getProjectById };
