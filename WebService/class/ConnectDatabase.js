import pg from "pg";
import { Pool } from "pg";

class ConnectDatabase {
  constructor() {
    try {
      this.pool = new Pool({
        user: "varunharinath",
        password: "",
        host: "localhost",
        port: 5432,
        database: "envsync",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async dbQuery(querry) {
    try {
      return await this.pool.query(querry);
    } catch (e) {
      console.log(e);
    }
  }
}

export const db = new ConnectDatabase();
