import type { Goal, Progress } from "interfaces";
import type { Database } from "../database";

class GoalRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getById(id: string): Goal | undefined {
    return this.#database.db.data?.goals.find((goal) => goal.id === id);
  }

  getManyById(ids: string[]): Goal[] {
    return this.#database.db?.data?.goals.filter((goal) =>
      ids.find((id) => {
        if (goal.id === id) return goal;
      })
    ) as Goal[]; // is always at least returning an empty array instead of undefined;
  }

  getActive(projectId: string): Goal | undefined {
    return this.#database.db.data?.goals.filter((goal) => {
      if (goal.projectId === projectId && goal.active === true) return goal;
    })[0]; // will only ever be one active goal, so get the first
  }

  async add(goal: Goal): Promise<Goal> {
    this.#database.db.data?.goals.push(this.#database.generateUniqueId(goal));
    await this.#database.db.write();
    return this.#database.db.data?.goals.find((g) => g.id === goal.id) as Goal;
  }

  async update(goal: Goal): Promise<Goal> {
    const filteredGoals = this.#database.db.data?.goals.filter(
      (g) => g.id !== goal.id
    ) as Goal[];
    this.#database.db.data!.goals = filteredGoals;
    this.#database.db.data?.goals.push(goal);
    await this.#database.db.write();
    return this.getById(goal.id!)!; // double !s because this items will always be in db by this point
  }

  async delete(id: string): Promise<void> {
    // Must delete all related progress or else you have progress with a goal that doesn't exist
    const filteredProgress = this.#database.db.data?.progress.filter(
      (progress) => progress.goalId !== id
    ) as Progress[];
    this.#database.db.data!.progress = filteredProgress;

    const filteredGoals = this.#database.db.data?.goals.filter(
      (g) => g.id !== id
    ) as Goal[];
    this.#database.db.data!.goals = filteredGoals;
    await this.#database.db.write();
  }
}

export default GoalRepository;
