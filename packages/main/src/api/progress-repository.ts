import type { Progress } from "interfaces";
import type Database from "../database";

class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getProgressByDate(date: Date): Date | undefined {
    
  }
}

export default ProgressRepository;
