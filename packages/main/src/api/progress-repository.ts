import type { Progress } from "interfaces";
import type Database from "../database";

class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  // all dates passed in as ISO strings
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
    // do the remove here
    // then do this.add()
    // we only want to run db.write() once
  }

  delete(date: string): void {
    const filteredProgress = this.#database.db.data!.progress.filter(
      (progress) => {
        // Check against the YYYY-MM-DD without the timezone
        const [progressFromDatabaseDate, _] = progress.date
          .toString()
          .split("T");
        const [dateToDelete, _time] = date.split("T");
        if (progressFromDatabaseDate !== dateToDelete) return progress;
      }
    );
    this.#database.db.data.progress = filteredProgress;
    this.#database.db.write();
  }
}

export default ProgressRepository;
