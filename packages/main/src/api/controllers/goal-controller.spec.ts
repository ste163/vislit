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
      active: true,
      completed: false,
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

    it("returns error if existing goal is not in database ", () => {
      expect(goalController.update({
        id: "2",
        projectId: "1",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 2,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
      })).toEqual(new Error('Goal with id 2 does not exist in database'));
    });

    it("returns error if activeGoal does not exist in database", () => {
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
       getGoalById: jest.fn(() => goal),
       getActiveGoal: jest.fn(() => undefined)
      } as unknown as GoalRepository;
  
      const goalController = new GoalController(
        mockGoalRepository,
        projectController
      );

      expect(goalController.update(goal)).toEqual(new Error('No active goal for project id 1 exists in database'));
    });

    it("returns error if the existing goal id does not equal project's active goal id", () => {
      const goal: Goal = {
        id: '1',
        projectId: "1",
        basedOnWordCountOrPageCount: "word",
        wordOrPageCount: 500,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
      };

      const mockActiveGoal = {
        id: '999'
      };

      const mockGoalRepository = {
       getGoalById: jest.fn(() => goal),
       getActiveGoal: jest.fn(() => mockActiveGoal),
      } as unknown as GoalRepository;
  
      const goalController = new GoalController(
        mockGoalRepository,
        projectController
      );

      expect(goalController.update(goal)).toEqual(new Error('The goal you are trying to update with id 1 does not match the active goal with id 999'));
    });

    it("returns the updated active goal and sets the previous goal as inactive", () => {
      const goal: Goal = {
        id: "1",
        projectId: "1",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 2,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
      };

      const response = goalController.update(goal) as Goal;
      expect(response.active).toBe(true);
      expect(response.basedOnWordCountOrPageCount).toBe('page');

      const goalsAfterFirstUpdate = [...database.db.data!.goals];
      expect(goalsAfterFirstUpdate.length).toBe(2);

      const originalGoal = goalsAfterFirstUpdate[0];
      const updatedGoal = goalsAfterFirstUpdate[1]; // updated goal is always last because it's pushed to end of array
      expect(originalGoal.active).toBe(false);
      expect(originalGoal.basedOnWordCountOrPageCount).toBe('word');
      expect(updatedGoal.active).toBe(true);
      expect(updatedGoal.basedOnWordCountOrPageCount).toBe('page');
    });

  it("returns error if deleting goal by id not in database", () => {
    expect(goalController.delete("999")).toEqual(
      new Error("Goal with id 999 does not exist in database")
    );
  });

  it("returns true if goal successfully deleted", () => {
    expect(goalController.delete("1")).toEqual(true);
  });
});
