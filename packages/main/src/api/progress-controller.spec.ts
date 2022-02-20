/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Project, Goal, Progress } from "interfaces";
import type FileSystemController from "./file-system-controller";

import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import GoalRepository from "./goal-repository";
import ProgressController from "./progress-controller";
import ProgressRepository from "./progress-repository";
import ProjectController from "./project-controller";
import ProjectRepository from "./project-repository";

describe("progress-controller", () => {
  let seedProjects: Project[];
  let seedGoals: Goal[];
  let seedProgress: Progress[];
  let database: Database;
  let goalRepository: GoalRepository;
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

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
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
        isDaily: false,
        daysPerMonth: 14,
        wordCount: 500,
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
      {
        id: "2",
        projectId: "2",
        wordCount: 2,
        isDaily: true,
        daysPerMonth: null,
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
        date: progressSeedDate1, // duplicate date for project's 1 and 2
        projectId: "2",
        goalId: "1",
        count: 2,
        edited: false,
        proofread: false,
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
    progressRepository = new ProgressRepository(database);
    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(database);
    searchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );
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

  it("getByDate - returns error schema doesn't match", () => {
    const request = {
      projectId: "3",
      date: new Date("2020-01-01") as any as string,
    };
    expect(progressController.getByDate(request)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("getByDate - returns error if no project exists", () => {
    const request = {
      projectId: "3",
      date: new Date().toISOString(),
    };
    expect(progressController.getByDate(request)).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("getByDate - returns undefined if no date found", () => {
    const request = {
      projectId: "1",
      date: new Date().toISOString(),
    };

    expect(progressController.getByDate(request)).toBeUndefined();
  });

  it("getByDate - returns error if progress found but with a goal not in database", () => {
    const request = {
      projectId: "1",
      date: progressSeedDate3,
    };

    expect(progressController.getByDate(request)).toEqual(
      new Error("No goal by id 0 found")
    );
  });

  it("getByDate - returns progress if date found with false completed if goal not met", () => {
    const request = {
      projectId: "1",
      date: progressSeedDate1,
    };

    expect(progressController.getByDate(request)).toEqual({
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
    const request = {
      projectId: "2",
      date: progressSeedDate4,
    };

    expect(progressController.getByDate(request)).toEqual({
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
    const request = {
      projectId: "2",
      date: progressSeedDate5,
    };

    expect(progressController.getByDate(request)).toEqual({
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
    const request = {
      projectId: "2",
      date: progressSeedDate6,
    };

    expect(progressController.getByDate(request)).toEqual({
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
    const request = {
      projectId: "2",
      date: progressSeedDate7,
    };

    expect(progressController.getByDate(request)).toEqual({
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

  it("getAll - returns error incorrect schema", () => {
    const request = {
      projectId: "3",
      year: "2020",
      month: "January",
    };

    expect(progressController.getAll(request)).toEqual(
      new Error("Request does not match schema")
    );
  });
  it("getAll - returns error if no project exists", () => {
    const request = {
      projectId: "3",
      year: "2020",
      month: "03",
    };

    expect(progressController.getAll(request)).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("getAll - returns empty array if no progress by year-month found", () => {
    const request = {
      projectId: "1",
      year: "1999",
      month: "01",
    };

    expect(progressController.getAll(request)).toEqual([]);
  });

  it("getAll - returns all progress by year-month", () => {
    const request = {
      projectId: "1",
      year: "2020",
      month: "01",
    };

    expect(progressController.getAll(request)).toEqual([
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

  it("modify - returns error if doesn't match schema", async () => {
    const progressDate = new Date("2020-01-20");
    const progress: Progress = {
      date: progressDate as any as string,
      projectId: "3",
      goalId: "1",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(await progressController.modify(progress)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("modify - returns error if no project exists", async () => {
    const progressDate = new Date("2020-01-20").toISOString();
    const progress: Progress = {
      date: progressDate,
      projectId: "3",
      goalId: "1",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(await progressController.modify(progress)).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("modify - returns error if no goal for project exists", async () => {
    const progressDate = new Date("2020-01-20").toISOString();
    const progress: Progress = {
      date: progressDate,
      projectId: "1",
      goalId: "999",
      count: 700,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(await progressController.modify(progress)).toEqual(
      new Error("Goal with id 999 does not exist on Project with id 1")
    );
  });

  it("modify - returns added progress if date does not exist", async () => {
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
    expect(await progressController.modify(progress)).toEqual(progress);
  });

  it("modify - returns true after deleting if date exists but incoming progress count is 0 and all info is false", async () => {
    const progress: Progress = {
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 0,
      edited: false,
      proofread: false,
      revised: false,
    };
    expect(await progressController.modify(progress)).toEqual(true);
  });

  it("modify - returns updated progress if date exists", async () => {
    const progress: Progress = {
      date: progressSeedDate1,
      projectId: "1",
      goalId: "1",
      count: 20,
      edited: true,
      proofread: true,
      revised: false,
    };
    expect(await progressController.modify(progress)).toEqual(progress);
  });
});
