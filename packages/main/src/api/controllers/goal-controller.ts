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
      this.#goalRepository.delete(goal.id!);
      // use the goalRespo.update() to update the existingGoal
      // and re-adds it to db
      // THEN
      // add the param goal to db with the this.add(goal)
      // then return the goal from add (so just do a return on the add)
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
