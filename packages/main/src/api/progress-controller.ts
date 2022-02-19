import type { Progress, Goal } from "interfaces";
import type GoalRepository from "./goal-repository";
import type ProgressRepository from "./progress-repository";
import type ProjectController from "./project-controller";
import type {
  getAllProgressRequest,
  getProgressByDateRequest,
  modifyProgressRequest,
} from "../schemas";
import {
  getProgressByDateRequestSchema,
  getAllProgressRequestSchema,
  modifyProgressRequestSchema,
} from "../schemas";

class ProgressController {
  #progressRepository: ProgressRepository;
  #goalRepository: GoalRepository;
  #projectController: ProjectController;

  constructor(
    progressRepository: ProgressRepository,
    goalRepository: GoalRepository,
    projectController: ProjectController
  ) {
    this.#progressRepository = progressRepository;
    this.#goalRepository = goalRepository;
    this.#projectController = projectController;
  }

  // All Goals are being returned to frontend based on Project: { goals: Goals[] },
  // process all completed status on backend
  #calculateCompletedStatus(progress: Progress[]): Progress[] {
    const goalIds: string[] = progress?.map(({ goalId }) => goalId);

    const goals: Goal[] = this.#goalRepository.getManyById(goalIds);

    return progress.map((progress) => {
      const goal = goals.find(({ id }) => id === progress.goalId);
      if (!goal) throw new Error(`No goal by id ${progress.goalId} found`);

      if (
        goal.wordCount <= progress.count ||
        (goal.proofreadCountsTowardGoal === true &&
          progress.proofread === true) ||
        (goal.editCountsTowardGoal === true && progress.edited === true) ||
        (goal.revisedCountsTowardsGoal === true && progress.revised === true)
      ) {
        progress.completed = true;
        return progress;
      }
      progress.completed = false;
      return progress;
    });
  }

  getByDate(request: getProgressByDateRequest): Progress | undefined | Error {
    try {
      getProgressByDateRequestSchema.parse(request);
      const { projectId, date } = request;
      // Not checking for goalId because dates can only exists on a single goal
      const response = this.#projectController.getById(projectId);
      if (response instanceof Error) throw response;
      const progress = this.#progressRepository.getByDate(projectId, date);
      if (progress) return this.#calculateCompletedStatus([progress])[0];
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getAll(request: getAllProgressRequest): Progress[] | undefined | Error {
    try {
      getAllProgressRequestSchema.parse(request);
      const { projectId, year, month } = request;
      const response = this.#projectController.getById(projectId);
      if (response instanceof Error) throw response;
      const progress = this.#progressRepository.getAllByYearMonth(
        projectId,
        year,
        month
      );
      if (progress) return this.#calculateCompletedStatus(progress);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  // add, update, or delete based on changes to progress
  // not checking for completed status as frontend re-fetching status after completed modification
  async modify(
    progress: modifyProgressRequest
  ): Promise<true | Progress | Progress[] | Error> {
    try {
      modifyProgressRequestSchema.parse(progress);
      const project = this.#projectController.getById(progress.projectId);
      if (project instanceof Error) throw project;

      // ensure there's a goal to modify
      const goal = project!.goals!.find(
        (goal: Goal) => goal.id === progress.goalId
      );

      if (!goal)
        throw new Error(
          `Goal with id ${progress.goalId} does not exist on Project with id ${progress.projectId}`
        );

      const existingProgress = this.#progressRepository.getByDate(
        progress.projectId,
        progress.date
      );

      if (!existingProgress)
        return await this.#progressRepository.add(progress);
      // If user reset all data/unchecked, delete progress
      return progress.count === 0 &&
        progress.edited === false &&
        progress.proofread === false &&
        progress.revised === false
        ? await this.#progressRepository.delete(existingProgress.date)
        : await this.#progressRepository.update(progress);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default ProgressController;
