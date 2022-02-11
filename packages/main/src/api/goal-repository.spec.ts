/**
 * @jest-environment node
 */
import type { Goal, Project } from "interfaces";
import Database from "../database";
import GoalRepository from "./goal-repository";

describe("goal-repository", () => {
  let seedProjects: Project[];
  let seedGoals: Goal[];
  let database: Database;
  let goalRepository: GoalRepository;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
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
        description: "An evil hotel possesses a groundskeeper",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      },
    ];
    seedGoals = [
      {
        id: "1",
        projectId: "2",
        basedOnWordCountOrPageCount: "word",
        wordOrPageCount: 500,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: false,
        completed: false,
      },
      {
        id: "2",
        projectId: "2",
        basedOnWordCountOrPageCount: "page",
        wordOrPageCount: 1,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: false,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ];
    database = new Database(app);
    database.db.data!.projects = seedProjects;
    database.db.data!.goals = seedGoals;
    goalRepository = new GoalRepository(database);
  });

  it("returns undefined if no goal by id found", () => {
    expect(goalRepository.getById("999")).toBeUndefined();
  });

  it("returns goal by id", () => {
    expect(goalRepository.getById("1")).toEqual({
      id: "1",
      projectId: "2",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: false,
      completed: false,
    });
  });

  it("returns empty array if no goals by id found", () => {
    expect(goalRepository.getManyById(["998", "999"])).toStrictEqual([]);
  });

  it("returns all goals found with those ids", () => {
    expect(goalRepository.getManyById(["1", "2"])).toEqual(seedGoals);
  });

  it("returns undefined if no goals with that projectId", () => {
    expect(goalRepository.getActive("999")).toEqual(undefined);
  });

  it("returns undefined if projectId in database but no active goals", () => {
    expect(goalRepository.getActive("1")).toEqual(undefined);
  });

  it("returns active goal by projectId", () => {
    const goal = goalRepository.getActive("2");
    expect(goal).toEqual({
      id: "2",
      projectId: "2",
      basedOnWordCountOrPageCount: "page",
      wordOrPageCount: 1,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: false,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    });
  });

  it("returns goal after successful add", () => {
    const goalToAdd: Goal = {
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 250,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    goalRepository.add(goalToAdd);
    expect(database.db.data?.goals.length).toEqual(3);
  });

  it("returns updated goal after successful update", () => {
    const goal = goalRepository.getById("1");
    if (goal) {
      goal.basedOnWordCountOrPageCount = "page";
      goal.wordOrPageCount = 5;
      const updatedGoal = goalRepository.update(goal);
      expect(updatedGoal.basedOnWordCountOrPageCount).toBe("page");
      expect(updatedGoal.wordOrPageCount).toBe(5);
      expect(updatedGoal.id).toEqual(goal.id);
    }
  });

  it("returns void if goal deleted", () => {
    const initialGoalCount = database.db.data?.goals.length as number;
    goalRepository.delete("1");
    const postDeleteGoalCount = database.db.data?.goals.length;
    expect(postDeleteGoalCount).toEqual(initialGoalCount - 1);
  });
});
