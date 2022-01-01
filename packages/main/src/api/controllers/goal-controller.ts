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

  // Needed as separate from update controller method because
  // update adds new goal to log, which is not needed here
  setAsCompletedById(id: string): Goal | Error {
    try {
      const goal = this.#goalRepository.getGoalById(id);
      if (goal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);

      // PROBLEM:
      // After setting complete to true
      // what should the active state become?
      // Probably false and then frontend would check for any active goals.
      // If known, display info for the most recent.
      // This should not do the toggle but be very explicit on the true/false
      // so that active state never doubles up
      // should probably also ensure that you're only toggling the active goal
      // Because you can not edit goals in the log, only delete them

      goal.completed = true;
      goal.active = false;

      goal.dateModified = new Date();

      return this.#goalRepository.update(goal);
    } catch (error: any | Error) {
      console.log(error);
      return error;
    }
  }

  update(goal: Goal): Goal | Error {
    try {
      const existingGoal = this.#goalRepository.getGoalById(goal.id!);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${goal.id} does not exist in database`);

      const activeGoal = this.#goalRepository.getActiveGoal(goal.projectId);
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
