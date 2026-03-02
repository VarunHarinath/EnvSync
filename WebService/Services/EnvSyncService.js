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
  // Get all projects
  async getProject() {
    try {
      const getProjects = await this.envSyncRepo.getProjects();
      return getProjects;
    } catch (e) {
      throw e;
    }
  }

  // Get Project by Id
  async getProjectById(project_id) {
    try {
      const getProjectById = await this.envSyncRepo.getProjectById(project_id);
      return getProjectById;
    } catch (e) {
      throw e;
    }
  }
  // Update Project Name by Project Id

  async updateProjectNameById(project_id, name) {
    try {
      const updateProjectNameById =
        await this.envSyncRepo.updateNameByProjectId(project_id, name);
      return updateProjectNameById;
    } catch (e) {
      throw e;
    }
  }
  // Delete Project by ID
  async deleteProjectById(project_id) {
    try {
      const deleteProjectById =
        await this.envSyncRepo.deleteProjectById(project_id);
      return deleteProjectById;
    } catch (e) {
      throw e;
    }
  }
  // -------------------------------------------------------

  //   Environment creation based on user Project_id and name for the Environment
  async newEnvironment(project_id, environmentName) {
    try {
      const createEnvironment = await this.envSyncRepo.createEnvironment(
        project_id,
        environmentName,
      );
      return createEnvironment;
    } catch (e) {
      throw e;
    }
  }
  // Get All the Environments based on the project_id

  async getEnvironmentsById(project_id) {
    try {
      const getEnvironmentsById =
        await this.envSyncRepo.getEnvironmentsById(project_id);
      return getEnvironmentsById;
    } catch (e) {
      throw e;
    }
  }

  // Update Environment By Id

  async updateEnvironmentById(environment_id, name) {
    try {
      const updateEnvironmentById =
        await this.envSyncRepo.updateEnvironmentById(environment_id, name);
      return updateEnvironmentById;
    } catch (e) {
      throw e;
    }
  }

  // Delete Environments by Id

  async deleteEnvironmentById(environment_id) {
    try {
      const deleteEnvironmentById =
        await this.envSyncRepo.deleteEnvironmentById(environment_id);
      return deleteEnvironmentById;
    } catch (e) {
      throw e;
    }
  }

  // Creating secret variable based on Project_id and the name of the variable
  async newSecret(project_id, name, value) {
    try {
      const createSecret = await this.envSyncRepo.createSecretAtomic(
        project_id,
        name,
        value
      );
      return createSecret;
    } catch (e) {
      throw e;
    }
  }

  // getSecrets based on the project_id
  async getSecretsByProjectId(project_id) {
    try {
      const getSecretsByProjectId =
        await this.envSyncRepo.getSecretsByProjectId(project_id);
      return getSecretsByProjectId;
    } catch (e) {
      throw e;
    }
  }

  // Get Secret & Secret Value by secret_id
  async getSecretsById(secret_id) {
    try {
      const getSecretsById = await this.envSyncRepo.getSecretsById(secret_id);
      const getSecretValueBySecretId =
        await this.envSyncRepo.getSecretValueBySecretId(secret_id);

      return { getSecretsById, getSecretValueBySecretId };
    } catch (e) {
      throw e;
    }
  }

  // Update secret & secret Value by secret_id
  async updateSecretById(secret_id, name, value) {
    try {
      const updateSecret = await this.envSyncRepo.updateSecretAtomic(
        secret_id,
        name,
        value
      );
      return updateSecret;
    } catch (e) {
      throw e;
    }
  }

  // Delete secret & secret Value by secret_id
  async deleteSecretById(secret_id) {
    try {
      const deleteSecret =
        await this.envSyncRepo.deleteSecretAtomic(secret_id);
      return deleteSecret;
    } catch (e) {
      throw e;
    }
  }

  //   Creating the Environment_Secrets using the environment_id and secret_id for Join Lookup
  async newEnvironmentSecret(environment_id, secret_id) {
    try {
      const createEnvironmentSecret =
        await this.envSyncRepo.createEnvironmentSecrets(
          environment_id,
          secret_id,
        );
      return createEnvironmentSecret;
    } catch (e) {
      throw e;
    }
  }

  // Getting all the mapped data from the environment secret using joins and environmentSecret_id

  async getEnvironmentSecretsById(environment_id) {
    try {
      const getEnvironmentSecretsById =
        await this.envSyncRepo.getEnvironmentSecretsById(environment_id);
      return getEnvironmentSecretsById;
    } catch (e) {
      throw e;
    }
  }

  // Update the table using the id

  async updateEnvironmentSecretById(
    environment_secret_id,
    environment_id,
    secret_id,
  ) {
    try {
      const updateEnvironmentSecretById =
        await this.envSyncRepo.updateEnvironmentSecretById(
          environment_secret_id,
          environment_id,
          secret_id,
        );
      return updateEnvironmentSecretById;
    } catch (e) {
      throw e;
    }
  }

  // Deleting the data from the Environment Secret Table using it's ID

  async deleteEnvironmentSecretById(environment_secret_id) {
    try {
      const deleteEnvironmentSecretById =
        await this.envSyncRepo.deleteEnvironmentSecretById(
          environment_secret_id,
        );
      return deleteEnvironmentSecretById;
    } catch (e) {
      throw e;
    }
  }

  async newApi(project_id, environment_id, key_hash, key_prefix) {
    try {
      const createApi = await this.envSyncRepo.createApi(
        project_id,
        environment_id,
        key_hash,
        key_prefix,
      );
      return createApi;
    } catch (e) {
      throw e;
    }
  }

  // Get API Keys by Project Id
  async getApiKeysByProjectId(project_id) {
    try {
      const getApiKeys = await this.envSyncRepo.getApiKeysByProjectId(project_id);
      return getApiKeys;
    } catch (e) {
      throw e;
    }
  }

  // Delete API Key
  async deleteApiKeyById(api_key_id) {
    try {
      const deleteApi = await this.envSyncRepo.deleteApiKeyById(api_key_id);
      return deleteApi;
    } catch (e) {
      throw e;
    }
  }
}

export const envSyncService = new EnvSyncService();
