import EnvSyncRepo from "../Utilities/EnvSyncRepo.js";
class EnvSyncService {
  constructor() {
    this.envSyncRepo = new EnvSyncRepo();
  }
  //   Project creation based on name and return the successful transaction
  async newProject(projectName) {
    try {
      const createProject = await this.envSyncRepo.createProject(projectName);
      return createProject;
    } catch (e) {
      throw e;
    }
  }
  //   Environment creation based on user Project_id and name for the Environment
  async newEnvironment(project_id, environmentName) {
    try {
      const createEnvironment = await this.envSyncRepo.createEnvironment(
        project_id,
        environmentName
      );
      return createEnvironment;
    } catch (e) {
      throw e;
    }
  }
  // Creating secret variable based on Project_id and the name of the variable
  async newSecret(project_id, secretName) {
    try {
      const createSecret = await this.envSyncRepo.createSecrets(
        project_id,
        secretName
      );
      return createSecret;
    } catch (e) {
      throw e;
    }
  }
  //   Creating the secrect value using the secret_id and value given
  async newSecretValue(secrect_id, secrectValue) {
    try {
      const createSecretValue = await this.envSyncRepo.createSecretsValue(
        secrect_id,
        secrectValue
      );
      return createSecretValue;
    } catch (e) {
      throw e;
    }
  }
  //   Creating the Environment_Secrets using the environment_id and secret_id for Join Lookup
  async newEnvironmentSecret(environment_id, secrect_id) {
    try {
      const createEnvironmentSecret =
        await this.envSyncRepo.createEnvironmentSecrets(
          environment_id,
          secrect_id
        );
      return createEnvironmentSecret;
    } catch (e) {
      throw e;
    }
  }
  //   Creating API Table for Environment_ID & hash_key storage
  async newApi(project_id, environment_id, key_hash, key_prefix) {
    try {
      const createApi = await this.envSyncRepo.createApi(
        project_id,
        environment_id,
        key_hash,
        key_prefix
      );
      return createApi;
    } catch (e) {
      throw e;
    }
  }
}

export default EnvSyncService;
