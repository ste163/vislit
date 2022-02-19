/**
 * @jest-environment node
 */
import type { Goal, Project } from "interfaces";
import { Database, initializeDatabase } from "../database";
import ProjectRepository from "./project-repository";
import ProjectController from "./project-controller";
import GoalRepository from "./goal-repository";
import GoalController from "./goal-controller";
import { ZodError } from "zod";
import type { SearchController } from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type { updateGoalRequest } from "../schemas";

describe("goal-controller", () => {
  let seedProjects: Project[];
  let seedGoal: Goal;
  let database: Database;
  let projectRepository: ProjectRepository;
  let projectController: ProjectController;
  let goalRepository: GoalRepository;
  let goalController: GoalController;

  beforeEach(async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    seedProjects = [
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
    seedGoal = {
      id: "1",
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };
    database.db.data.projects = seedProjects;
    database.db.data.goals.push(seedGoal);
    projectRepository = new ProjectRepository(database);
    const mockSearchController = jest.fn() as unknown as SearchController;
    const mockFileSystemController =
      jest.fn() as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      mockSearchController,
      mockFileSystemController
    );
    goalRepository = new GoalRepository(database);
    goalController = new GoalController(goalRepository, projectController);
  });

  it("returns error if adding project that does not match schema", async () => {
    const goal = {
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };

    expect(await goalController.add(goal as Goal)).toBeInstanceOf(ZodError);
  });

  it("returns error if adding project by projectId not in database", async () => {
    const goal: Goal = {
      projectId: "999",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };

    expect(await goalController.add(goal)).toEqual(
      new Error("Project with id 999 not in database")
    );
  });

  it("returns error if adding a goal to a project with an already active goal", async () => {
    const goal: Goal = {
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    expect(await goalController.add(goal)).toEqual(
      new Error("Active goal already exists for project with id 1")
    );
  });

  it("returns error if adding goal fails", async () => {
    const goal: Goal = {
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    const mockGoalRepository = {
      getActive: jest.fn(() => undefined),
      add: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.add(goal)).toEqual(new Error());
  });

  it("returns added project", async () => {
    const goal: Goal = {
      projectId: "2",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    const addedGoal = await goalController.add(goal);

    expect((addedGoal as Goal).projectId).toEqual("2");
    expect(addedGoal).toHaveProperty("id");
  });

  it("returns error if trying to set goal complete with id that doesn't match schema", async () => {
    expect(await goalController.delete(123 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns error when setting complete for a goal by id not in database", async () => {
    expect(await goalController.setCompletedById("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("returns error when setting complete for a project without an active goal", async () => {
    const mockGoalRepository = {
      getById: jest.fn(() => seedGoal),
      getActive: jest.fn(() => undefined),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.setCompletedById("1")).toEqual(
      new Error("No active goal for project id 1 exists in database")
    );
  });

  it("returns error when setting complete when the goal does not match the active goal", async () => {
    const mockActiveGoal = {
      id: "999",
    };

    const mockGoalRepository = {
      getById: jest.fn(() => seedGoal),
      getActive: jest.fn(() => mockActiveGoal),
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

  it("returns the updated goal with the set complete", async () => {
    const updatedGoal = (await goalController.setCompletedById("1")) as Goal;
    expect(updatedGoal.completed).toEqual(true);
  });

  it("returns error if updating goal that doesn't match schema", async () => {
    expect(
      await goalController.update({
        id: "2",
        projectId: "1",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 2,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: true,
      })
    ).toBeInstanceOf(ZodError);
  });

  it("returns error if updating existing goal is not in database", async () => {
    expect(
      await goalController.update({
        id: "2",
        projectId: "1",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 2,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      })
    ).toEqual(new Error("Goal with id 2 does not exist in database"));
  });

  it("returns error if updating activeGoal does not exist in database", async () => {
    const goal: Goal = {
      id: "999",
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };

    const mockGoalRepository = {
      getById: jest.fn(() => goal),
      getActive: jest.fn(() => undefined),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(await goalController.update(goal as updateGoalRequest)).toEqual(
      new Error("No active goal for project id 1 exists in database")
    );
  });

  it("returns error if updating the existing goal id does not equal project's active goal id", async () => {
    const goal: Goal = {
      id: "1",
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
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
      getById: jest.fn(() => goal),
      getActive: jest.fn(() => mockActiveGoal),
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

  it("returns the updated active goal and sets the previous goal as inactive", async () => {
    const goal: Goal = {
      id: "1",
      projectId: "1",
      basedOnWordCountOrPageCount: "page",
      wordOrPageCount: 2,
      frequencyToRepeat: "daily",
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
    expect(response.basedOnWordCountOrPageCount).toBe("page");

    const goalsAfterFirstUpdate = [...database.db.data!.goals];
    expect(goalsAfterFirstUpdate.length).toBe(2);

    const originalGoal = goalsAfterFirstUpdate[0];
    const updatedGoal = goalsAfterFirstUpdate[1]; // updated goal is always last because it's pushed to end of array
    expect(originalGoal.active).toBe(false);
    expect(originalGoal.basedOnWordCountOrPageCount).toBe("word");
    expect(updatedGoal.active).toBe(true);
    expect(updatedGoal.basedOnWordCountOrPageCount).toBe("page");
  });

  it("returns error if trying to delete with id that doesn't match schema", async () => {
    expect(await goalController.delete(123 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns error if deleting goal by id not in database", async () => {
    expect(await goalController.delete("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("returns true if goal successfully deleted", async () => {
    expect(await goalController.delete("1")).toEqual(true);
  });
});
