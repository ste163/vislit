import type { Goal, Project } from "interfaces";
import Database from "../database";
import ProjectRepository from "../repositories/project-repository";
import ProjectController from "./project-controller";
import GoalRepository from "../repositories/goal-repository";
import GoalController from "./goal-controller";
import type SearchController from "./search-controller";
import type FileSystemController from "./file-system-controller";

describe("goal-controller", () => {
  let seedProject: Project;
  let seedGoal: Goal;
  let database: Database;
  let projectRepository: ProjectRepository;
  let projectController: ProjectController;
  let goalRepository: GoalRepository;
  let goalController: GoalController;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    seedProject = {
      id: "1",
      title: "It",
      description: "A murderous clown attacks a town",
      typeId: "1",
      completed: false,
      archived: false,
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    seedGoal = {
      id: "1",
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    database.db.data?.projects.push(seedProject);
    database.db.data?.goals.push(seedGoal);
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

  it("returns error if adding project by projectId not in database", () => {
    const goal: Goal = {
      projectId: "999",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };

    expect(goalController.add(goal)).toEqual(
      new Error("Project with id 999 not in database")
    );
  });

  it("returns error if adding goal fails", () => {
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
      add: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as GoalRepository;

    const goalController = new GoalController(
      mockGoalRepository,
      projectController
    );

    expect(goalController.add(goal)).toEqual(new Error());
  });

  it("returns added project", () => {
    const goal: Goal = {
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    const addedGoal = goalController.add(goal);

    expect((addedGoal as Goal).projectId).toEqual("1");
    expect(addedGoal).toHaveProperty("id");
  });

  //   it("returns error if existing goal is undefined", () => {});

  //   it("returns error if activeGoal is undefined", () => {});

  //   it("returns error if first active goal is undefined", () => {});

  //   it("returns error if there is more than one active goal", () => {});

  //   it("returns error if the existing goal does not equal the first (and only) active goal", () => {});

  //   it("returns the updated active goal and sets the previous goal as inactive", () => {});

  it("returns error if deleting goal by id not in database", () => {
    expect(goalController.delete("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("returns true if goal successfully deleted", () => {
    expect(goalController.delete("1")).toEqual(true);
  });
});
