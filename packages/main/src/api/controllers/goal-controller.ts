import type { Goal } from "interfaces";
import type GoalRepository from "../repositories/goal-repository";
import type ProjectController from "./project-controller";

class GoalController {
  #goalRepository: GoalRepository;
  #projectController: ProjectController;

  constructor(
    goalRepository: GoalRepository,
    projectController: ProjectController
  ) {
    this.#goalRepository = goalRepository;
    this.#projectController = projectController;
  }

  add(goal: Goal): Goal | Error {
    try {
      const existingProject = this.#projectController.getById(goal.projectId);
      if (existingProject instanceof Error) return existingProject;

      const date = new Date();
      goal.dateCreated = date;
      goal.dateModified = date;
      goal.active = true;
      goal.completed = false;

      return this.#goalRepository.add(goal);
    } catch (error: any | Error) {
      console.log(error);
      return error;
    }
  }
}

export default GoalController;
