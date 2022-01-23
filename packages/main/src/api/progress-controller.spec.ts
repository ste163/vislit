/**
 * @jest-environment node
 */
import type { Project, Goal, Progress } from "interfaces";
import Database from "../database";
import type FileSystemController from "./file-system-controller";
import ProgressController from "./progress-controller";
import ProgressRepository from "./progress-repository";
import ProjectController from "./project-controller";
import ProjectRepository from "./project-repository";
import SearchController from "./search-controller";

describe("progress-controller-integration", () => {
  let seedProjects: Project[];
  let seedGoals: Goal[];
  let seedProgress: Progress[];
  let database: Database;
  let progressRepository: ProgressRepository;
  let projectRepository: ProjectRepository;
  let searchController: SearchController;
  let projectController: ProjectController;
  let progressController: ProgressController;
  const progressSeedDate1 = new Date("2020-01-01").toISOString();
  const progressSeedDate2 = new Date("2020-01-15").toISOString();

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    const projectSeedDate = new Date();
    seedProjects = [
      {
        id: "1",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: projectSeedDate,
        dateModified: projectSeedDate,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: projectSeedDate,
        dateModified: projectSeedDate,
      },
    ];
    seedGoals = [
      {
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
      },
    ];
    seedProgress = [
      {
        date: progressSeedDate1,
        projectId: "1",
        goalId: "1",
        count: 250,
        edited: false,
        proofread: false,
        revised: false,
      },
      {
        date: progressSeedDate2,
        projectId: "1",
        goalId: "1",
        count: 500,
        edited: false,
        proofread: true,
        revised: false,
      },
    ];

    database.db.data!.projects = seedProjects;
    database.db.data!.goals = seedGoals;
    database.db.data!.progress = seedProgress;

    projectRepository = new ProjectRepository(database);
    progressRepository = new ProgressRepository(database);
    searchController = new SearchController(projectRepository);
    const mockFileSystemController = {} as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      searchController,
      mockFileSystemController
    );
    progressController = new ProgressController(
      progressRepository,
      projectController
    );
  });

  // test
  // if goal doesn't exist in db, throw error
  // if count is not met and all false, return progress not completed
  // if word count is met and all false, set as completed
  // if word count not met, but proofread true, completed
  // if word count not met, but edit true, completed
  // if word count not met, but revised true, completed

  it("getByDate - returns error if no project exists", () => {
    expect(progressController.getByDate("3", new Date().toISOString())).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("getByDate - returns undefined if no date found", () => {
    expect(
      progressController.getByDate("1", new Date().toISOString())
    ).toBeUndefined();
  });

  it("getByDate - returns progress if date found", () => {
    expect(progressController.getByDate("1", progressSeedDate1)).toEqual({
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 250,
      edited: false,
      proofread: false,
      revised: false,
    });
  });

  it("getAll - returns error if no project exists", () => {
    expect(progressController.getAll("3", "2020", "03")).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("getAll - returns empty array if no progress by year-month found", () => {
    expect(progressController.getAll("1", "1999", "01")).toEqual([]);
  });

  it("getAll - returns all progress by year-month", () => {
    expect(progressController.getAll("1", "2020", "01")).toEqual(seedProgress);
  });

  it("modify - returns error if no project exists", () => {
    const progressDate = new Date("2020-01-20");
    const progress: Progress = {
      date: progressDate,
      projectId: "3",
      goalId: "1",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(progressController.modify(progress)).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("modify - returns error if no goal for project exists", () => {
    const progressDate = new Date("2020-01-20");
    const progress: Progress = {
      date: progressDate,
      projectId: "1",
      goalId: "999",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(progressController.modify(progress)).toEqual(
      new Error("Goal with id 999 does not exist on Project with id 1")
    );
  });

  it("modify - returns added progress if date does not exist", () => {
    const progressDate = new Date("2020-01-20").toISOString();
    const progress: Progress = {
      date: progressDate,
      projectId: "1",
      goalId: "1",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(progressController.modify(progress)).toEqual(progress);
  });

  it("modify - returns true after deleting if date exists but incoming progress count is 0 and all info is false", () => {
    const progress: Progress = {
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 0,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(progressController.modify(progress)).toEqual(true);
  });

  it("modify - returns updated progress if date exists", () => {
    const progress: Progress = {
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 20,
      edited: true,
      proofread: true,
      revised: false,
    };
    expect(progressController.modify(progress)).toEqual(progress);
  });
});
