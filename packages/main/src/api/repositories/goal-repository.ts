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
    this.#database.db.data?.goals.push(this.#database.generateUniqueId(goal));
    this.#database.db.write();
    return this.#database.db.chain.get("goals").find({ dateCreated }).value();
  }

  update(goal: Goal): Goal {
    // ** overview
    // updating doesn't update
    // it sets the current goal as inactive
    // then creates a new goal
    // so that there is a log that I can sort by date modified
    // ** implementation
    // check that only 1 goal is active only
    // update the dateModified for that goal -> find by goal.id
    // set its active === false
    // .write() the db
    // take the updated goal param
    // then add(goal) after all its date values are updated
    // return updated goal
  }

  delete(goalId: string): void {
    // deletes a goal by id
    // this is not recommended on the UI side
    // but having the option to delete is still important
  }
}

export default GoalRepository;
