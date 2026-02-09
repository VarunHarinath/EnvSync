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
  async newSecret(project_id, secretName) {
    try {
      const createSecret = await this.envSyncRepo.createSecrets(
        project_id,
        secretName,
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
        secrectValue,
      );
      return createSecretValue;
    } catch (e) {
      throw e;
    }
  }

  // getSecrets based on the project_id

  async getSecretsByProjectId(project_id) {
    try {
      const getSecretsByProjectId =
        await this.envSyncRepo.getSecretsByProjectId(project_id);

      if (getSecretsByProjectId) {
        const getSecrectValueBySecrectId =
          await this.envSyncRepo.getSecrectValueBySecrectId(
            getSecretsByProjectId.id,
          );
        return { getSecretsByProjectId, getSecrectValueBySecrectId };
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  // Get Secrect & secrect Value by secrect_id
  async getSecretsById(secrect_id) {
    try {
      const getSecretsById = await this.envSyncRepo.getSecretsById(secrect_id);
      const getSecrectValueBySecrectId =
        await this.envSyncRepo.getSecrectValueBySecrectId(secrect_id);

      return { getSecretsById, getSecrectValueBySecrectId };
    } catch (e) {
      throw e;
    }
  }

  // Update secrect & secrect Value by secret_id
  async updateSecrectById(secrect_id, name, value) {
    try {
      const updateSecrectById = await this.envSyncRepo.updateSecretsById(
        secrect_id,
        name,
      );
      const updateSecrectValueBySecrectId =
        await this.envSyncRepo.updateSecrectValueBySecrectId(secrect_id, value);
      return { updateSecrectById, updateSecrectValueBySecrectId };
    } catch (e) {
      throw e;
    }
  }

  // Delete secrect & secrect Value by Secret_id
  async deleteSecrectById(secrect_id) {
    try {
      const deleteSecrectById =
        await this.envSyncRepo.deleteSecrectById(secrect_id);
      const deleteSecrectValueBySecrectId =
        await this.envSyncRepo.deleteSecrectValueBySecrectId(secrect_id);

      return { deleteSecrectById, deleteSecrectValueBySecrectId };
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
          secrect_id,
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
        key_prefix,
      );
      return createApi;
    } catch (e) {
      throw e;
    }
  }
}

export const envSyncService = new EnvSyncService();
