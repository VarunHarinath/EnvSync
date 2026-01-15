import { db } from "./ConnectDatabase.js";

class DataBaseSchema {
  // INSERT PREPAID Statements
  createProject(name) {
    const querry = {
      text: "INSERT INTO projects(name) values($1)",
      values: [name],
    };
  }
}
