import type { Goal } from "interfaces";
import type GoalRepository from "./goal-repository";
import type ProjectController from "./project-controller";
import type {
  addGoalRequest,
  idRequest,
  updateGoalRequest,
} from "./request-schemas";
import {
  idRequestSchema,
  addGoalRequestSchema,
  updateGoalRequestSchema,
} from "./request-schemas";
import handleError from "./util-handle-error";

class GoalController {
  constructor(
    private goalRepository: GoalRepository,
    private projectController: ProjectController
  ) {}

  async add(goal: addGoalRequest): Promise<Error | Goal> {
    try {
      addGoalRequestSchema.parse(goal);
      const existingProject = this.projectController.getById(goal.projectId);
      if (existingProject instanceof Error) return existingProject;

      const activeGoal = this.goalRepository.getActive(goal.projectId);
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

      return await this.goalRepository.add(goalToAdd);
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  // Needed as separate from update controller method because
  // update adds new goal to log, which is not needed here
  async setCompletedById(id: idRequest): Promise<Error | Goal> {
    try {
      idRequestSchema.parse(id);
      const goal = this.goalRepository.getById(id);
      if (goal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);

      const activeGoal = this.goalRepository.getActive(goal.projectId);
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

      return await this.goalRepository.update(goal);
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async update(request: updateGoalRequest): Promise<Goal | Error> {
    try {
      updateGoalRequestSchema.parse(request);

      const { id, projectId } = request;

      const existingGoal = this.goalRepository.getById(id);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);

      const activeGoal = this.goalRepository.getActive(projectId);
      if (activeGoal === undefined)
        throw new Error(
          `No active goal for project id ${projectId} exists in database`
        );

      if (existingGoal.id !== activeGoal.id)
        // Only allows for updating the active goal
        throw new Error(
          `The goal you are trying to update with id ${existingGoal.id} does not match the active goal with id ${activeGoal.id}`
        );

      const goalToUpdate = { ...request } as Goal;

      existingGoal.dateModified = new Date();
      existingGoal.active = false;
      this.goalRepository.update(existingGoal);

      const newGoalDate = new Date();
      goalToUpdate.completed = false;
      goalToUpdate.active = true;
      goalToUpdate.dateCreated = newGoalDate;
      goalToUpdate.dateModified = newGoalDate;
      return await this.goalRepository.add(goalToUpdate);
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async delete(id: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(id);
      const existingGoal = this.goalRepository.getById(id);
      if (existingGoal === undefined)
        throw new Error(`Goal with id ${id} does not exist in database`);
      await this.goalRepository.delete(id);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }
}

export default GoalController;
