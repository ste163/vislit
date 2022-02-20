/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Goal, Project } from "interfaces";
import type { SearchController } from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type { updateGoalRequest } from "../schemas";
import { Database, initializeDatabase } from "../database";
import ProjectRepository from "./project-repository";
import ProjectController from "./project-controller";
import GoalRepository from "./goal-repository";
import GoalController from "./goal-controller";

describe("goal-controller", () => {
  let seedGoal: Goal;
  let database: Database;
  let projectRepository: ProjectRepository;
  let projectController: ProjectController;
  let goalRepository: GoalRepository;
  let goalController: GoalController;

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    seedGoal = {
      id: "1",
      projectId: "1",
      wordCount: 500,
      isDaily: false,
      daysPerMonth: 14,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };
    database.db.data!.projects = [
      {
        id: "1",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      },
      {
        id: "2",
        title: "The Shining",
        description: "A murderous clown attacks a town",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      },
    ];
    database.db.data!.goals.push(seedGoal);
    projectRepository = new ProjectRepository(database);
    const mockSearchController = vi.fn() as unknown as SearchController;
    const mockFileSystemController = vi.fn() as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      mockSearchController,
      mockFileSystemController
    );
    goalRepository = new GoalRepository(database);
    goalController = new GoalController(goalRepository, projectController);
  });

  it("add - returns error if adding project that does not match schema", async () => {
    const goal = {
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };

    expect(await goalController.add(goal as any)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("add - returns error if adding project by projectId not in database", async () => {
    const goal = {
      projectId: "999",
      wordCount: 500,
      isDaily: true,
      daysPerMonth: null,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };

    expect(await goalController.add(goal)).toEqual(
      new Error("Project with id 999 not in database")
    );
  });

  it("add - returns error if adding a goal to a project with an already active goal", async () => {
    const goal = {
      projectId: "1",
      wordCount: 250,
      isDaily: false,
      daysPerMonth: 7,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    expect(await goalController.add(goal)).toEqual(
      new Error("Active goal already exists for project with id 1")
    );
  });

  it("add - returns added project", async () => {
    const goal = {
      projectId: "2",
      wordCount: 250,
      isDaily: false,
      daysPerMonth: 7,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    const addedGoal = await goalController.add(goal);
    expect((addedGoal as Goal).projectId).toEqual("2");
    expect(addedGoal).toHaveProperty("id");
  });

  it("setCompletedById - returns error if incorrect schema", async () => {
    expect(await goalController.setCompletedById(123 as any as string)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("setCompletedById - returns error for a goal by id not in database", async () => {
    expect(await goalController.setCompletedById("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("setCompletedById - returns error for a project without an active goal", async () => {
    const mockGoalRepository = {
      getById: vi.fn(() => seedGoal),
      getActive: vi.fn(() => undefined),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.setCompletedById("1")).toEqual(
      new Error("No active goal for project id 1 exists in database")
    );
  });

  it("setCompletedById - returns error when the goal does not match the active goal", async () => {
    const mockActiveGoal = {
      id: "999",
    };

    const mockGoalRepository = {
      getById: vi.fn(() => seedGoal),
      getActive: vi.fn(() => mockActiveGoal),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.setCompletedById("1")).toEqual(
      new Error(
        "The goal you are trying to update with id 1 does not match the active goal with id 999"
      )
    );
  });

  it("setCompletedById - returns the updated goal with complete true", async () => {
    const updatedGoal = (await goalController.setCompletedById("1")) as Goal;
    expect(updatedGoal.completed).toEqual(true);
  });

  it("update - returns error if incorrect schema", async () => {
    expect(
      await goalController.update({
        id: "2",
        projectId: "1",
        wordOrPageCount: 2,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: true,
      } as any)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("update - returns error if goal is not in database", async () => {
    expect(
      await goalController.update({
        id: "2",
        projectId: "1",
        wordCount: 250,
        isDaily: false,
        daysPerMonth: 7,
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      })
    ).toEqual(new Error("Goal with id 2 does not exist in database"));
  });

  it("update - returns error if activeGoal does not exist in database", async () => {
    const goal: Goal = {
      id: "999",
      projectId: "1",
      wordCount: 250,
      isDaily: false,
      daysPerMonth: 7,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };

    const mockGoalRepository = {
      getById: vi.fn(() => goal),
      getActive: vi.fn(() => undefined),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.update(goal as updateGoalRequest)).toEqual(
      new Error("No active goal for project id 1 exists in database")
    );
  });

  it("update - returns error if updating the existing goal id does not equal project's active goal id", async () => {
    const goal: Goal = {
      id: "1",
      projectId: "1",
      wordCount: 250,
      isDaily: false,
      daysPerMonth: 7,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };

    const mockActiveGoal = {
      id: "999",
    };

    const mockGoalRepository = {
      getById: vi.fn(() => goal),
      getActive: vi.fn(() => mockActiveGoal),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.update(goal as updateGoalRequest)).toEqual(
      new Error(
        "The goal you are trying to update with id 1 does not match the active goal with id 999"
      )
    );
  });

  it("update - returns the updated active goal and sets the previous goal as inactive", async () => {
    const goal: Goal = {
      id: "1",
      projectId: "1",
      wordCount: 150,
      isDaily: false,
      daysPerMonth: 7,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };

    const response = (await goalController.update(
      goal as updateGoalRequest
    )) as Goal;
    expect(response.active).toBe(true);
    expect(response.wordCount).toBe(150);

    const goalsAfterFirstUpdate = [...database.db.data!.goals];
    expect(goalsAfterFirstUpdate.length).toBe(2);

    const originalGoal = goalsAfterFirstUpdate[0];
    const updatedGoal = goalsAfterFirstUpdate[1]; // updated goal is always last because it's pushed to end of array
    expect(originalGoal.active).toBe(false);
    expect(originalGoal.wordCount).toBe(500);
    expect(updatedGoal.active).toBe(true);
    expect(updatedGoal.wordCount).toBe(150);
  });

  it("delete - returns error if incorrect schema", async () => {
    expect(await goalController.delete(123 as any as string)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("delete - returns error if id not in database", async () => {
    expect(await goalController.delete("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("delete - returns true if goal successfully deleted", async () => {
    expect(await goalController.delete("1")).toEqual(true);
  });
});
