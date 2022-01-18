import type { Progress } from "interfaces";
import type Database from "../database";

class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByDate(date: Date | string): Progress | undefined {
    return this.#database.db.chain.get("progress").find({ date }).value();
  }

  getAllByYearMonth(
    projectId: string,
    year: string,
    month: string
  ): Progress[] {
    return this.#database.db.data!.progress.filter((progress) => {
      if (progress.projectId === projectId) {
        const [date, _] = progress.date.toString().split("T");
        const [splitYear, splitMonth] = date.split("-");
        if (year === splitYear && month == splitMonth) return progress;
      }
    });
  }

  add(progess: Progress): Progress {}

  update(progress: Progress): Progress {}

  delete(date: Date): void {}
}

export default ProgressRepository;
