import type { Progress } from "interfaces";
import type Database from "../database";

class ProgressRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByDate(date: Date | string): Progress | undefined {
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
    //  do the remove here
    // then do this.add()
    // we only want to run db.write() once
  }

  delete(date: Date): void {
    // a non-lodash way would be to:
    // filter out all progress that does not === the provided date
    // (again, timezones would f' this up, so we need to be REALLY sure we're doing this right)
    // then re-set all the progress to the new array without that included progress
    // then write to the database
  }
}

export default ProgressRepository;
