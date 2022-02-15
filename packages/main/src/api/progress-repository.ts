import type { Progress } from "interfaces";
import type Database from "../database";

// all dates passed into repo are ISO strings
class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  #filterOutByDate(date: string): Progress[] {
    return this.#database.db.data!.progress.filter((progress) => {
      // Check against the YYYY-MM-DD without timezone
      const progressFromDb = progress.date.toString().split("T")[0];
      const dateToDelete = date.split("T")[0];
      if (progressFromDb !== dateToDelete) return progress;
    });
  }

  getByDate(date: string): Progress | undefined {
    return this.#database.db.data!.progress.filter((dbProgress) => {
      // Check against the YYYY-MM-DD without timezone
      const dbDate = dbProgress.date.toString().split("T")[0];
      const incomingDate = date.split("T")[0];
      if (dbDate === incomingDate) return dbProgress;
    })[0];
  }

  getAllByYearMonth(year: string, month: string): Progress[] {
    return this.#database.db.data!.progress.filter((progress) => {
      const date = progress.date.toString().split("T")[0];
      const [splitYear, splitMonth] = date.split("-");
      if (year === splitYear && month == splitMonth) return progress;
    });
  }

  async add(progress: Progress): Promise<Progress> {
    this.#database.db.data!.progress.push(progress);
    await this.#database.db.write();
    return this.getByDate(progress.date) as Progress;
  }

  async update(progress: Progress): Promise<Progress> {
    this.#database.db.data!.progress = this.#filterOutByDate(progress.date);
    return await this.add(progress);
  }

  async delete(date: string): Promise<true> {
    this.#database.db.data!.progress = this.#filterOutByDate(date);
    await this.#database.db.write();
    return true; // otherwise returns undefined, which could mean too many other things
  }
}

export default ProgressRepository;
