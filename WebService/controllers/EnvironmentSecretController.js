import { envSyncService } from "../Services/EnvSyncService.js";

const createEnvironmentSecret = async (req, res, next) => {
  try {
    const { environment_id, secret_id } = req.body;

    const createEnvironmentSecret = await envSyncService.newEnvironmentSecret(
      environment_id,
      secret_id,
    );
    res.json(createEnvironmentSecret);
  } catch (e) {
    next(e);
  }
};

export { createEnvironmentSecret };
