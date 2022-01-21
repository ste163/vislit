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
        goalId: "2",
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

  it("returns error if no project exists", () => {
    expect(progressController.getByDate("3", new Date().toISOString())).toEqual(
      new Error("Project with id 3 not in database")
    );
  });

  it("returns undefined if no date found", () => {
    expect(
      progressController.getByDate("1", new Date().toISOString())
    ).toBeUndefined();
  });

  it("returns progress if date found", () => {
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

  // getAll - error if no project exists
  // getAll - returns empty array if no dates found
  // getAll - returns dates by year and month if found

  // modify - error if no project exists
  // modify - error if no goal exists
  // modify - success - if no date in db, add
  // modify - success - if date already in db, update
  // modify - success - if date is already in db, but all information has been removed, delete from db
});
