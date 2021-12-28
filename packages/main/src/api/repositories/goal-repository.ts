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

  // do not need a getGoals as they are always included with the Project

  add(goal: Goal): Goal {
    // move the setting dateCreated to the controller
    // and not the repo
    // keeping it here for now for testing
    // need to also set active: true, completed false
    const dateCreated = new Date();
    goal.dateCreated = dateCreated;
    goal.dateModified = dateCreated;
    // the above 3 lines should be moved to controller
    // as it's preparing the object for saving
    this.#database.db.data?.goals.push(this.#database.generateUniqueId(goal));
    this.#database.db.write();
    return this.#database.db.chain.get("goals").find({ dateCreated }).value();
  }

  update(newGoal: Goal): Goal {
    // ACTUALLY
    // most of this logic should be in the controller level
    // so this should really be a 'setGoalAsInactive'
    // which updates dateModified and sets active = false
    // ** TODO **
    // Still MUST check for active goals, then if there's more than one, set all to false except active
    // for the current project
    const currentlyActiveGoal = this.#database.db.data?.goals.find(
      (goal) => goal.active
    );

    // update active goal for display in goal log
    if (currentlyActiveGoal) {
      currentlyActiveGoal.active = false;
      currentlyActiveGoal.dateModified = new Date();
      this.#database.db.chain
        .get("goals")
        .remove({ id: currentlyActiveGoal.id });
      this.#database.db.data?.goals.push(currentlyActiveGoal);

      newGoal.active = true;
      return this.add(newGoal); // .write() database in here (or should at least) --> will test
    }
    return newGoal; // to make TS happy for now
  }

  delete(goalId: string): void {
    // deletes a goal by id
    // this is not recommended on the UI side
    // but having the option to delete is still important
  }
}

export default GoalRepository;
