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
      // Check against the YYYY-MM-DD without the timezone
      const [progressFromDatabaseDate, _] = progress.date.toString().split("T");
      const [dateToDelete, _time] = date.split("T");
      if (progressFromDatabaseDate !== dateToDelete) return progress;
    });
  }

  getByDate(date: string): Progress | undefined {
    return this.#database.db.data!.progress.filter(
      (progress) => progress.date === date
    )[0];
  }

  getAllByYearMonth(year: string, month: string): Progress[] {
    return this.#database.db.data!.progress.filter((progress) => {
      const [date, _] = progress.date.toString().split("T");
      const [splitYear, splitMonth] = date.split("-");
      if (year === splitYear && month == splitMonth) return progress;
    });
  }

  add(progress: Progress): Progress {
    this.#database.db.data!.progress.push(progress);
    this.#database.db.write();
    return this.getByDate(progress.date) as Progress;
  }

  update(progress: Progress): Progress {
    this.#database.db.data.progress = this.#filterOutByDate(progress.date);
    return this.add(progress);
  }

  delete(date: string): void {
    this.#database.db.data.progress = this.#filterOutByDate(date);
    this.#database.db.write();
  }
}

export default ProgressRepository;
