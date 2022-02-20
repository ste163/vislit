import type { Progress } from "interfaces";
import type { Database } from "../database";

// all dates passed into repo are ISO strings
class ProgressRepository {
  constructor(private database: Database) {}

  #filterOutByDate(projectId: string, date: string): Progress[] {
    return this.database.db.data!.progress.filter((progress) => {
      if (progress.projectId !== projectId) return progress;
      // Check against the YYYY-MM-DD without timezone
      const progressFromDb = progress.date.toString().split("T")[0];
      const dateToDelete = date.split("T")[0];
      if (progressFromDb !== dateToDelete) return progress;
    });
  }

  getByDate(projectId: string, date: string): Progress | undefined {
    return this.database.db.data!.progress.filter((progress) => {
      if (progress.projectId === projectId) {
        // Check against the YYYY-MM-DD without timezone
        const dbDate = progress.date.toString().split("T")[0];
        const incomingDate = date.split("T")[0];
        if (dbDate === incomingDate) return progress;
      }
    })[0];
  }

  getAllByYearMonth(
    projectId: string,
    year: string,
    month: string
  ): Progress[] {
    return this.database.db.data!.progress.filter((progress) => {
      if (progress.projectId === projectId) {
        const date = progress.date.toString().split("T")[0];
        const [splitYear, splitMonth] = date.split("-");
        if (year === splitYear && month == splitMonth) return progress;
      }
    });
  }

  async add(progress: Progress): Promise<Progress> {
    this.database.db.data!.progress.push(progress);
    await this.database.db.write();
    return this.getByDate(progress.projectId, progress.date) as Progress;
  }

  async update(progress: Progress): Promise<Progress> {
    this.database.db.data!.progress = this.#filterOutByDate(
      progress.projectId,
      progress.date
    );
    return await this.add(progress);
  }

  async delete(projectId: string, date: string): Promise<true> {
    this.database.db.data!.progress = this.#filterOutByDate(projectId, date);
    await this.database.db.write();
    return true;
  }
}

export default ProgressRepository;
