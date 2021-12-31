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

  // will need a 'setAsCompletedById' because update does not allow for that

  update(goal: Goal): Goal | Error {
    try {
      const existingGoal = this.#goalRepository.getGoalById(goal.id!);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${goal.id} does not exist in database`);

      const activeGoal = this.#goalRepository.getActiveGoal(goal.projectId);
      if (activeGoal === undefined || activeGoal[0] === undefined)
        throw new Error(
          `No active goal for project id ${goal.projectId} exists in database`
        );

      if (activeGoal.length > 1)
        // the user has no way of changing this, or fixing this. So it's a bug on my end
        // do not check for this. Would need a different check, like, if more than one active goal, then you need to force all to be inactive
        // then update the database
        throw new Error(
          `Project id ${goal.projectId} has more than one active goal`
        );

      if (existingGoal !== activeGoal[0])
        // REALLY need to check if this is legit!!!
        // may need to do the loose checking
        throw new Error(
          `The goal you are trying to update with id ${existingGoal.id} does not match the active goal with id ${activeGoal[0].id}`
        );

      existingGoal.dateModified = new Date();
      existingGoal.active = false;
      this.#goalRepository.update(existingGoal);

      const newGoalDate = new Date();
      goal.completed = false;
      goal.active = true;
      goal.dateCreated = newGoalDate;
      goal.dateModified = newGoalDate;
      return this.#goalRepository.add(goal);
    } catch (error: any | Error) {
      console.log(error);
      return error;
    }
  }

  delete(id: string): true | Error {
    try {
      const existingGoal = this.#goalRepository.getGoalById(id);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);
      this.#goalRepository.delete(id);
      return true;
    } catch (error: any | Error) {
      console.log(error);
      return error;
    }
  }
}

export default GoalController;
