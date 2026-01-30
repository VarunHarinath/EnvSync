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
