/**
 * @jest-environment node
 */
import type { Project, Goal, Progress } from "interfaces";
import Database from "../database";
import type FileSystemController from "./file-system-controller";
import GoalRepository from "./goal-repository";
import NoteRepository from "./note-repository";
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
  let goalRepository: GoalRepository;
  let noteRepository: NoteRepository;
  let progressRepository: ProgressRepository;
  let projectRepository: ProjectRepository;
  let searchController: SearchController;
  let projectController: ProjectController;
  let progressController: ProgressController;
  const progressSeedDate1 = new Date("2020-01-01").toISOString();
  const progressSeedDate2 = new Date("2020-01-15").toISOString();
  const progressSeedDate3 = new Date("2021-01-25").toISOString();
  const progressSeedDate4 = new Date("2022-01-01").toISOString();
  const progressSeedDate5 = new Date("2022-01-02").toISOString();
  const progressSeedDate6 = new Date("2022-01-03").toISOString();
  const progressSeedDate7 = new Date("2022-01-04").toISOString();

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
      {
        id: "2",
        projectId: "2",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 2,
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
      {
        date: progressSeedDate3,
        projectId: "1",
        goalId: "0",
        count: 500,
        edited: false,
        proofread: true,
        revised: false,
      },
      {
        date: progressSeedDate4,
        projectId: "2",
        goalId: "1",
        count: 2,
        edited: false,
        proofread: true,
        revised: false,
      },
      {
        date: progressSeedDate5,
        projectId: "2",
        goalId: "1",
        count: 1,
        edited: true,
        proofread: false,
        revised: false,
      },
      {
        date: progressSeedDate6,
        projectId: "2",
        goalId: "1",
        count: 1,
        edited: false,
        proofread: true,
        revised: false,
      },
      {
        date: progressSeedDate7,
        projectId: "2",
        goalId: "1",
        count: 1,
        edited: false,
        proofread: false,
        revised: true,
      },
    ];

    database.db.data!.projects = seedProjects;
    database.db.data!.goals = seedGoals;
    database.db.data!.progress = seedProgress;

    goalRepository = new GoalRepository(database);
    projectRepository = new ProjectRepository(database);
    noteRepository = new NoteRepository(database);
    progressRepository = new ProgressRepository(database);
    searchController = new SearchController(database);
    const mockFileSystemController = {} as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      searchController,
      mockFileSystemController
    );
    progressController = new ProgressController(
      progressRepository,
      goalRepository,
      projectController
    );
  });

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

  it("getByDate - returns error if progress found but with a goal not in database", () => {
    expect(progressController.getByDate("1", progressSeedDate3)).toEqual(
      new Error("No goal by id 0 found")
    );
  });

  it("getByDate - returns progress if date found with false completed if goal not met", () => {
    expect(progressController.getByDate("1", progressSeedDate1)).toEqual({
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 250,
      edited: false,
      proofread: false,
      revised: false,
      completed: false,
    });
  });

  it("getByDate - returns completed progress if date found with goal count met only", () => {
    expect(progressController.getByDate("2", progressSeedDate4)).toEqual({
      date: progressSeedDate4,
      projectId: "2",
      goalId: "1",
      count: 2,
      edited: false,
      proofread: true,
      revised: false,
      completed: true,
    });
  });

  it("getByDate - returns completed progress if date found with proofread met only", () => {
    expect(progressController.getByDate("2", progressSeedDate5)).toEqual({
      date: progressSeedDate5,
      projectId: "2",
      goalId: "1",
      count: 1,
      edited: true,
      proofread: false,
      revised: false,
      completed: true,
    });
  });

  it("getByDate - returns completed progress if date found with edit met only", () => {
    expect(progressController.getByDate("2", progressSeedDate6)).toEqual({
      date: progressSeedDate6,
      projectId: "2",
      goalId: "1",
      count: 1,
      edited: false,
      proofread: true,
      revised: false,
      completed: true,
    });
  });

  it("getByDate - returns completed progress if date found with revised met only", () => {
    expect(progressController.getByDate("2", progressSeedDate7)).toEqual({
      date: progressSeedDate7,
      projectId: "2",
      goalId: "1",
      count: 1,
      edited: false,
      proofread: false,
      revised: true,
      completed: true,
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
    expect(progressController.getAll("1", "2020", "01")).toEqual([
      {
        date: progressSeedDate1,
        projectId: "1",
        goalId: "1",
        count: 250,
        edited: false,
        proofread: false,
        revised: false,
        completed: false,
      },
      {
        date: progressSeedDate2,
        projectId: "1",
        goalId: "1",
        count: 500,
        edited: false,
        proofread: true,
        revised: false,
        completed: true,
      },
    ]);
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
