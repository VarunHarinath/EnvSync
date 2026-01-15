import EnvSyncService from "../Services/EnvSyncService.js";

const createProject = async (req, res) => {
  try {
    const envSyncService = new EnvSyncService();
    const { name } = req.body;
    const result = await envSyncService.newProject(name);
    res.json(result);
  } catch (e) {
    console.error(e);
  }
};

export { createProject };
