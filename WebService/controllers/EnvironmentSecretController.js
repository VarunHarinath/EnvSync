import EnvSyncService from "../Services/EnvSyncService.js";

const createEnvironmentSecret = async (req, res) => {
  try {
    const { environment_id, secret_id } = req.body;
    const envSyncService = new EnvSyncService();
    const createEnvironmentSecret = await envSyncService.newEnvironmentSecret(
      environment_id,
      secret_id
    );
    res.json(createEnvironmentSecret);
  } catch (e) {
    res.json(e);
  }
};

export { createEnvironmentSecret };
