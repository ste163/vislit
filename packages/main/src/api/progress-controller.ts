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

  getByDate(projectId: string, date: string): Progress | undefined | Error {
    try {
      // don't need to check for goalId because there can only be 1 unique date per project
      // check if project exists
      // if it does, run getByDate(date)
      // if no error return progress or undefined
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getAll(projectId: string, year: string, month: string): Progress | Error {
    try {
      // check if project exists
      // if it does, run getAllbyYearMonth
      // if no error, return array
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  // add, update, or delete based on changes to progress
  modify(progress: Progress): Progress | Error {
    // could potentially handle add, update, and delete based on what is passed in.
    // if they remove all word/page count, and set everything to false, we should delete.
    // at which point, add becomes 'modify'
    // then the auto-save could just check the modify route
    try {
      // check if the project exists
      this.#projectController.getById(progress.projectId); // throws error if undefined
      // check if the goal exists
      // if there is no date in the database already
      // create the progress in the database
      // if there is a date already in the database
      // update
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default ProgressController;
