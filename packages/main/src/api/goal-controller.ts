import type { Goal } from "interfaces";
import type GoalRepository from "./goal-repository";
import type ProjectController from "./project-controller";
import type { addGoalRequest, idRequest, updateGoalRequest } from "../schemas";
import {
  idRequestSchema,
  addGoalRequestSchema,
  updateGoalRequestSchema,
} from "../schemas";

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

  add(goal: addGoalRequest): Goal | Error {
    try {
      addGoalRequestSchema.parse(goal);
      const existingProject = this.#projectController.getById(goal.projectId);
      if (existingProject instanceof Error) return existingProject;

      const activeGoal = this.#goalRepository.getActive(goal.projectId);
      if (activeGoal)
        throw new Error(
          `Active goal already exists for project with id ${goal.projectId}`
        );

      const goalToAdd = { ...goal } as Goal;

      const date = new Date();
      goalToAdd.dateCreated = date;
      goalToAdd.dateModified = date;
      goalToAdd.active = true;
      goalToAdd.completed = false;

      return this.#goalRepository.add(goalToAdd);
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  // Needed as separate from update controller method because
  // update adds new goal to log, which is not needed here
  setCompletedById(id: idRequest): Goal | Error {
    try {
      idRequestSchema.parse(id);
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
      console.error(error);
      return error;
    }
  }

  update(goal: updateGoalRequest): Goal | Error {
    try {
      updateGoalRequestSchema.parse(goal);
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

      const goalToUpdate = { ...goal } as Goal;

      existingGoal.dateModified = new Date();
      existingGoal.active = false;
      this.#goalRepository.update(existingGoal);

      const newGoalDate = new Date();
      goalToUpdate.completed = false;
      goalToUpdate.active = true;
      goalToUpdate.dateCreated = newGoalDate;
      goalToUpdate.dateModified = newGoalDate;
      return this.#goalRepository.add(goalToUpdate);
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  delete(id: idRequest): true | Error {
    try {
      idRequestSchema.parse(id);
      const existingGoal = this.#goalRepository.getById(id);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);
      this.#goalRepository.delete(id);
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }
}

export default GoalController;
