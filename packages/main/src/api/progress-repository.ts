import type { Progress } from "interfaces";
import type Database from "../database";

class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByDate(date: Date): Progress | undefined {
    return this.#database.db.chain.get("progress").find({ date }).value();
  }

  add(progess: Progress): Progress {}

  update(progress: Progress): Progress {}

  delete(date: Date): void {}
}

export default ProgressRepository;
