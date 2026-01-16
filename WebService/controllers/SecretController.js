import EnvSyncService from "../Services/EnvSyncService.js";

const createSecret = async (req, res) => {
  try {
    const { project_id, secretName, secretValue } = req.body;
    const envSyncService = new EnvSyncService();
    const createSecret = await envSyncService.newSecret(project_id, secretName);
    const createSecretValue = await envSyncService.newSecretValue(
      createSecret.id,
      secretValue
    );
    res.json(createSecretValue);
  } catch (e) {
    res.json(e);
  }
};

export { createSecret };
