import type { Goal } from "interfaces";
import type GoalRepository from "./goal-repository";
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

      const activeGoal = this.#goalRepository.getActive(goal.projectId);
      if (activeGoal)
        throw new Error(
          `Active goal already exists for project with id ${goal.projectId}`
        );

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

  // Needed as separate from update controller method because
  // update adds new goal to log, which is not needed here
  setCompletedById(id: string): Goal | Error {
    try {
      const goal = this.#goalRepository.getById(id);
      if (goal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);

      const activeGoal = this.#goalRepository.getActive(goal.projectId);
      if (activeGoal === undefined)
        throw new Error(
          `No active goal for project id ${goal.projectId} exists in database`
        );

      if (goal.id !== activeGoal.id)
        // Only allows for updating the active goal
        throw new Error(
          `The goal you are trying to update with id ${goal.id} does not match the active goal with id ${activeGoal.id}`
        );

      goal.active = false;
      goal.completed = true;
      goal.dateModified = new Date();

      return this.#goalRepository.update(goal);
    } catch (error: any | Error) {
      console.log(error);
      return error;
    }
  }

  update(goal: Goal): Goal | Error {
    try {
      const existingGoal = this.#goalRepository.getById(goal.id!);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${goal.id} does not exist in database`);

      const activeGoal = this.#goalRepository.getActive(goal.projectId);
      if (activeGoal === undefined)
        throw new Error(
          `No active goal for project id ${goal.projectId} exists in database`
        );

      if (existingGoal.id !== activeGoal.id)
        // Only allows for updating the active goal
        throw new Error(
          `The goal you are trying to update with id ${existingGoal.id} does not match the active goal with id ${activeGoal.id}`
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
      const existingGoal = this.#goalRepository.getById(id);
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
