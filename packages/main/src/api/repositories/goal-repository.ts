// goals can be:
// updated -> each time it's updated:
// -- make sure all other goals are set to inactive. Set the most active one to inactive
// -- while also updating the date modified
// -- then create a new goal with the updated values
// deleted -> delete only happens through a modal and is not recommended
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

  // doesn't appear to ever use the passed in goal
  // but may need to update code to use the passed in goal
  // probably would be best
  setGoalAsInactive(goal: Goal): void {
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
    }
  }
}

export default GoalRepository;
