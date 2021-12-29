import type { Goal } from "interfaces";
import type Database from "../database";

class GoalRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getGoalById(id: string): Goal | undefined {
    return this.#database.db.data?.goals.find((goal) => goal.id === id);
  }

  getActiveGoal(projectId: string): Goal[] | undefined {
    // should only ever be 1 active goal
    return this.#database.db.data?.goals.filter((goal) => {
      if (goal.projectId === projectId && goal.active === true) return goal;
    });
  }

  add(goal: Goal): Goal {
    this.#database.db.data?.goals.push(this.#database.generateUniqueId(goal));
    this.#database.db.write();
    return this.#database.db.chain.get("goals").find({ id: goal.id }).value();
  }

  // have a basic update
  // that deletes the goal by id (like normal)
  // then re-adds it and returns it
  // w/o doing anyting related to generatingUniqueId

  delete(id: string): void {
    this.#database.db.chain.get("goals").remove({ id }).value();
    this.#database.db.write();
  }
}

export default GoalRepository;
