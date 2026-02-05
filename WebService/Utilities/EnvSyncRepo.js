import { db } from "./ConnectDatabase.js";

class EnvSyncRepo {
  // INSERT PREPAID Statements
  async createProject(name) {
    try {
      const query = {
        text: "INSERT INTO projects(name) values($1) RETURNING * ;",
        values: [name],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // Get all the projects
  async getProjects() {
    try {
      const query = {
        text: "SELECT * FROM projects",
      };
      const result = await db.dbQuery(query.text);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  // Get Project by Id
  async getProjectById(project_id) {
    try {
      const query = {
        text: "SELECT * FROM projects WHERE id = $1",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Update name by ProjectId
  // ***** TO ADD: UPDATE ONLY IF THE VERSION IS SAME BEFORE UPDATING;

  async updateNameByProjectId(project_id, name) {
    try {
      const query = {
        text: "UPDATE projects SET name = $1,updated_at = NOW() WHERE id = $2 RETURNING * ;",
        values: [name, project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      console.log(result);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Delete project by Id

  async deleteProjectById(project_id) {
    try {
      const query = {
        text: "DELETE FROM projects WHERE id = $1 RETURNING *",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // Create Environment
  async createEnvironment(project_id, name) {
    try {
      const query = {
        text: "INSERT INTO environments(project_id,name) values($1,$2) RETURNING *",
        values: [project_id, name],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Get Environment by Id

  async getEnvironmentsById(project_id) {
    try {
      const query = {
        text: "SELECT * FROM environments WHERE project_id = $1",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // update EnvironmentById
  async updateEnvironmentById(environment_id, name) {
    try {
      const query = {
        text: "UPDATE environments SET name = $1,updated_at = NOW() WHERE id = $2 RETURNING * ;",
        values: [name, environment_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // delete Environment by Id

  async deleteEnvironmentById(environment_id) {
    try {
      const query = {
        text: "DELETE FROM environments WHERE id = $1 RETURNING *",
        values: [environment_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // Creating secrects by project_id
  async createSecrets(project_id, name) {
    try {
      const query = {
        text: "INSERT INTO secrets(project_id,name) values($1,$2) RETURNING *",
        values: [project_id, name],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  // Get all the secrets by the Project_id
  async getSecretsByProjectId(project_id) {
    try {
      const query = {
        text: "SELECT * FROM secrets WHERE project_id = $1",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch {
      throw e;
    }
  }
  // Get Secrects by Project_id
  async getSecretsById(secrect_id) {
    try {
      const query = {
        text: "SELECT * FROM secrets WHERE id = $1",
        values: [secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // update Secrets by secrect_id
  async updateSecretsById(secrect_id, name) {
    try {
      const query = {
        text: "UPDATE secrets SET name = $1,updated_at = NOW() WHERE id = $2 RETURNING *",
        values: [name, secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // delete Secrets by secrect_id
  async deleteSecrectById(secrect_id) {
    try {
      const query = {
        text: "DELETE FROM secrets WHERE id = $1",
        values: [secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Create secretsValue by secret_id
  async createSecretsValue(secret_id, value) {
    try {
      const query = {
        text: "INSERT INTO secret_values(secret_id,value) values($1,$2) RETURNING *",
        values: [secret_id, value],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // get Secrect_Value by secrect_id
  async getSecrectValueBySecrectId(secrect_id) {
    try {
      const query = {
        text: "SELECT * FROM secret_values WHERE secret_id = $1",
        values: [secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // update Secrect_Value by secrect_id
  async updateSecrectValueBySecrectId(secrect_id, value) {
    try {
      const query = {
        text: "UPDATE secret_values SET value = $1,updated_at = NOW() WHERE secret_id = $2 RETURNING *",
        values: [value, secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // Delete Secrect Value by Secrect Id
  async deleteSecrectValueBySecrectId(secrect_id) {
    try {
      const query = {
        text: "DELETE FROM secret_values WHERE secret_id = $1",
        values: [secrect_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  async createEnvironmentSecrets(environment_id, secret_id) {
    try {
      const query = {
        text: "INSERT INTO environment_secrets(environment_id,secret_id) values($1,$2) RETURNING *",
        values: [environment_id, secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async createApi(project_id, environment_id, key_hash, key_prefix) {
    try {
      const query = {
        text: "INSERT INTO api_keys(project_id,environment_id,key_hash,key_prefix) values($1,$2,$3,$4) RETURNING *",
        values: [project_id, environment_id, key_hash, key_prefix],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
}

export default EnvSyncRepo;
