import EnvSyncService from "../Services/EnvSyncService.js";
const createEnvironment = async (req, res) => {
  try {
    const { environmentName, project_id } = req.body;
    const envSyncService = new EnvSyncService();
    const createEnvironment = await envSyncService.newEnvironment(
      project_id,
      environmentName,
    );
    res.json(createEnvironment);
  } catch (e) {
    next(e);
  }
};

export { createEnvironment };
