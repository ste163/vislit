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

  add(goal: Goal): Goal {
    this.#database.db.data?.goals.push(this.#database.generateUniqueId(goal));
    this.#database.db.write();
    return this.#database.db.chain.get("goals").find({ id: goal.id }).value();
  }

  delete(id: string): void {
    this.#database.db.chain.get("goals").remove({ id }).value();
    this.#database.db.write();
  }

  // Actually, this should all happen at the Controller level.
  // the only thing I need is "getActiveGoal" that returns an array of Goals[]
  // if the length is more than 1 (becuse there should only ever be 1 active goal)
  // throw error
  setGoalAsInactive(goal: Goal): void {
    // check that goal with this id is in database -> Controller level
    // check that the goal is actually active
    // if it's trying to set an inactive goal as inactive, throw error
    const currentlyActiveGoal = this.#database.db.data?.goals.find(
      (goal) => goal.active
    );
    if (currentlyActiveGoal) {
      currentlyActiveGoal.active = false;
      currentlyActiveGoal.dateModified = new Date();
      this.#database.db.chain
        .get("goals")
        .remove({ id: currentlyActiveGoal.id });
      this.#database.db.data?.goals.push(currentlyActiveGoal);
      this.#database.db.write();
    }
  }
}

export default GoalRepository;
