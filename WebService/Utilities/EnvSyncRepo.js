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
        text: `
          SELECT e.*, COUNT(es.id) AS secrets_count 
          FROM environments e 
          LEFT JOIN environment_secrets es ON e.id = es.environment_id 
          WHERE e.project_id = $1 
          GROUP BY e.id
        `,
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows;
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
  // Creating secrets by project_id
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
        text: "SELECT s.*, sv.value FROM secrets s LEFT JOIN secret_values sv ON s.id = sv.secret_id WHERE s.project_id = $1",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }
  // Get Secrets by id
  async getSecretsById(secret_id) {
    try {
      const query = {
        text: "SELECT * FROM secrets WHERE id = $1",
        values: [secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // update Secrets by secret_id
  async updateSecretsById(secret_id, name) {
    try {
      const query = {
        text: "UPDATE secrets SET name = $1,updated_at = NOW() WHERE id = $2 RETURNING *",
        values: [name, secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // delete Secret by Id
  // delete Secret by Id
  async deleteSecretById(secret_id) {
    try {
      const query = {
        text: "DELETE FROM secrets WHERE id = $1 RETURNING *",
        values: [secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Transaction Support
  async beginTransaction() {
    await db.dbQuery("BEGIN");
  }

  async commitTransaction() {
    await db.dbQuery("COMMIT");
  }

  async rollbackTransaction() {
    await db.dbQuery("ROLLBACK");
  }

  // Atomic Secret Creation
  async createSecretAtomic(project_id, name, value) {
    try {
      await this.beginTransaction();

      const secretQuery = {
        text: "INSERT INTO secrets(project_id, name) VALUES($1, $2) RETURNING *",
        values: [project_id, name],
      };
      const secretResult = await db.dbQuery(
        secretQuery.text,
        secretQuery.values,
      );
      const secret = secretResult.rows[0];

      const valueQuery = {
        text: "INSERT INTO secret_values(secret_id, value) VALUES($1, $2) RETURNING *",
        values: [secret.id, value],
      };
      const valueResult = await db.dbQuery(valueQuery.text, valueQuery.values);

      await this.commitTransaction();
      return { ...secret, value: valueResult.rows[0].value };
    } catch (e) {
      await this.rollbackTransaction();
      throw e;
    }
  }

  // Atomic Secret Update
  async updateSecretAtomic(secret_id, name, value) {
    try {
      await this.beginTransaction();

      const secretQuery = {
        text: "UPDATE secrets SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        values: [name, secret_id],
      };
      const secretResult = await db.dbQuery(
        secretQuery.text,
        secretQuery.values,
      );

      const valueQuery = {
        text: "UPDATE secret_values SET value = $1, updated_at = NOW() WHERE secret_id = $2 RETURNING *",
        values: [value, secret_id],
      };
      await db.dbQuery(valueQuery.text, valueQuery.values);

      await this.commitTransaction();
      return secretResult.rows[0];
    } catch (e) {
      await this.rollbackTransaction();
      throw e;
    }
  }

  // Atomic Secret Deletion
  async deleteSecretAtomic(secret_id) {
    try {
      await this.beginTransaction();

      // environment_secrets and secret_values have ON DELETE CASCADE,
      // but we do it explicitly or just rely on it. Let's rely on it but ensure the order is right if needed.
      // Actually, DELETE on secrets will trigger cascade.

      const query = {
        text: "DELETE FROM secrets WHERE id = $1 RETURNING *",
        values: [secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);

      await this.commitTransaction();
      return result.rows[0];
    } catch (e) {
      await this.rollbackTransaction();
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

  // get Secret_Value by secret_id
  async getSecretValueBySecretId(secret_id) {
    try {
      const query = {
        text: "SELECT * FROM secret_values WHERE secret_id = $1",
        values: [secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // update Secret_Value by secret_id
  async updateSecretValueBySecretId(secret_id, value) {
    try {
      const query = {
        text: "UPDATE secret_values SET value = $1,updated_at = NOW() WHERE secret_id = $2 RETURNING *",
        values: [value, secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
  // Delete Secret Value by Secret Id
  async deleteSecretValueBySecretId(secret_id) {
    try {
      const query = {
        text: "DELETE FROM secret_values WHERE secret_id = $1",
        values: [secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Get Environment Secret by environmentSecret_id

  async getEnvironmentSecretsById(environment_id) {
    try {
      const query = {
        text: "SELECT es.id AS environment_secret_id,es.environment_id,s.id AS secret_id,s.name AS secret_name,sv.id AS secret_value_id,sv.value FROM environment_secrets es JOIN secrets s ON es.secret_id = s.id LEFT JOIN secret_values sv ON s.id = sv.secret_id WHERE es.environment_id = $1",
        values: [environment_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  // Creating new Environment based on the given environment_id and secret_id
  async createEnvironmentSecrets(environment_id, secret_id) {
    try {
      const query = {
        text: "INSERT INTO environment_secrets(environment_id,secret_id) values($1,$2) RETURNING *",
        values: [environment_id, secret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Updating Environment Secrets based on the Environment Secret ID

  async updateEnvironmentSecretById(
    environmentSecret_id,
    environment_id,
    secret_id,
  ) {
    try {
      const query = {
        text: "UPDATE environment_secrets SET environment_id = $1, secret_id = $2 WHERE id = $3 RETURNING *",
        values: [environment_id, secret_id, environmentSecret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }

  // Deleting the Environment Secrets Based on the Environment Secret ID

  async deleteEnvironmentSecretById(environmentSecret_id) {
    try {
      const query = {
        text: "DELETE FROM environment_secrets WHERE id = $1",
        values: [environmentSecret_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
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

  // Get API Keys by Project Id
  async getApiKeysByProjectId(project_id) {
    try {
      const query = {
        text: "SELECT ak.*, e.name as environment_name FROM api_keys ak JOIN environments e ON ak.environment_id = e.id WHERE ak.project_id = $1 ORDER BY ak.created_at DESC",
        values: [project_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows;
    } catch (e) {
      throw e;
    }
  }

  // Delete API Key (Revocation)
  async deleteApiKeyById(api_key_id) {
    try {
      const query = {
        text: "DELETE FROM api_keys WHERE id = $1 RETURNING *",
        values: [api_key_id],
      };
      const result = await db.dbQuery(query.text, query.values);
      return result.rows[0];
    } catch (e) {
      throw e;
    }
  }
}

export default EnvSyncRepo;
