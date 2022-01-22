import type { Progress, Project, Goal } from "interfaces";
import type ProgressRepository from "./progress-repository";
import type ProjectController from "./project-controller";

class ProgressController {
  #progressRepository: ProgressRepository;
  #projectController: ProjectController;

  constructor(
    progressRepository: ProgressRepository,
    projectController: ProjectController
  ) {
    this.#progressRepository = progressRepository;
    this.#projectController = projectController;
  }

  getByDate(projectId: string, date: string): Progress | undefined | Error {
    try {
      // Not checking for goalId because dates can only exists on a single goal
      const response = this.#projectController.getById(projectId);
      if (response instanceof Error) throw response;
      return this.#progressRepository.getByDate(date);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getAll(projectId: string, year: string, month: string): Progress | Error {
    try {
      const response = this.#projectController.getById(projectId);
      if (response instanceof Error) throw response;
      return this.#progressRepository.getAllByYearMonth(year, month);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  // add, update, or delete based on changes to progress
  modify(progress: Progress): Progress | Error {
    try {
      const project = this.#projectController.getById(progress.projectId);
      if (project instanceof Error) throw project;

      const goal = project.goals.find(
        (goal: Goal) => goal.id === progress.goalId
      );

      if (!goal)
        throw new Error(
          `Goal with id ${progress.goalId} does not exist on Project with id ${progress.projectId}`
        );

      const existingProgress = this.#progressRepository.getByDate(
        progress.date
      );

      if (!existingProgress) return this.#progressRepository.add(progress);

      // If user reset all data/unchecked, delete progress
      return progress.count === 0 &&
        progress.edited === false &&
        progress.proofread === false &&
        progress.revised === false
        ? this.#progressRepository.delete(existingProgress.date)
        : this.#progressRepository.update(progress);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default ProgressController;
