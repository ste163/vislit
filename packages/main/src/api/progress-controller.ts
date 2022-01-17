import type Progress from "interfaces";
import type GoalController from "./goal-controller";
import type ProgressRepository from "./progress-repository";
import type ProjectController from "./project-controller";

class ProgressController {
  #progressRepository: ProgressRepository;
  #projectController: ProjectController;
  #goalController: GoalController;

  constructor(
    progressRepository: ProgressRepository,
    projectController: ProjectController,
    goalController: GoalController
  ) {
    this.#progressRepository = progressRepository;
    this.#projectController = projectController;
    this.#goalController = goalController;
  }

  // adds or updates
  add(progress: Progress): Progress | Error {
    // check if the project exists
    // check if the goal exists
    // if there is no date in the database already
    // create the progress in the database
    // if there is a date already in the database
    // update
  }

  delete(date: string): true | Error {
    // check if project exists
    // check if goal exists
    // check if there is a date for this progress in db
    // delete
  }
}

export default ProgressController;
