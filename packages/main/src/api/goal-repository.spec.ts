/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Goal } from "interfaces";
import { Database, initializeDatabase } from "../database";
import GoalRepository from "./goal-repository";
import type DataPath from "../data-path";

describe("goal-repository", () => {
  let database: Database;
  let goalRepository: GoalRepository;

  beforeEach(async () => {
    const mockDataPath = {
      get: vi.fn(() => ""),
    } as any as DataPath;

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const initDb = await initializeDatabase(mockDataPath);

    database = new Database(initDb, mockDataPath);
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
        description: "An evil hotel possesses a groundskeeper",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: new Date(),
        dateModified: new Date(),
      },
    ];
    database.db.data!.goals = [
      {
        id: "1",
        projectId: "2",
        wordCount: 500,
        isDaily: false,
        daysPerMonth: 14,
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: false,
        completed: false,
      },
      {
        id: "2",
        projectId: "2",
        wordCount: 1,
        isDaily: true,
        daysPerMonth: null,
        proofreadCountsTowardGoal: false,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ];
    database.db.data!.progress = [
      {
        date: new Date().toISOString(),
        projectId: "1",
        goalId: "1",
        count: 250,
        edited: false,
        proofread: false,
        revised: false,
      },
      {
        date: new Date().toISOString(),
        projectId: "1",
        goalId: "1",
        count: 500,
        edited: false,
        proofread: true,
        revised: false,
      },
      {
        date: new Date().toISOString(),
        projectId: "1",
        goalId: "2",
        count: 300,
        edited: false,
        proofread: false,
        revised: true,
      },
    ];
    goalRepository = new GoalRepository(database);
  });

  it("getById - returns undefined if no goal by id found", () => {
    expect(goalRepository.getById("999")).toBeUndefined();
  });

  it("getById - returns goal by id", () => {
    expect(goalRepository.getById("1")).toEqual({
      id: "1",
      projectId: "2",
      wordCount: 500,
      isDaily: false,
      daysPerMonth: 14,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: false,
      completed: false,
    });
  });

  it("getManyById - returns empty array if no goals by id found", () => {
    expect(goalRepository.getManyById(["998", "999"])).toStrictEqual([]);
  });

  it("getManyById - returns all goals found with those ids", () => {
    expect(goalRepository.getManyById(["1", "2"])).toEqual([
      {
        id: "1",
        projectId: "2",
        wordCount: 500,
        isDaily: false,
        daysPerMonth: 14,
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: false,
        completed: false,
      },
      {
        id: "2",
        projectId: "2",
        wordCount: 1,
        isDaily: true,
        daysPerMonth: null,
        proofreadCountsTowardGoal: false,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ]);
  });

  it("getActive - returns undefined if no goals with that projectId", () => {
    expect(goalRepository.getActive("999")).toEqual(undefined);
  });

  it("getActive - returns undefined if projectId in database but no active goals", () => {
    expect(goalRepository.getActive("1")).toEqual(undefined);
  });

  it("getActive - returns active goal by projectId", () => {
    const goal = goalRepository.getActive("2");
    expect(goal).toEqual({
      id: "2",
      projectId: "2",
      wordCount: 1,
      isDaily: true,
      daysPerMonth: null,
      proofreadCountsTowardGoal: false,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    });
  });

  it("add - returns goal after successful add", async () => {
    const goalToAdd: Goal = {
      projectId: "1",
      isDaily: true,
      daysPerMonth: null,
      wordCount: 250,
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      completed: false,
      active: true,
    };
    await goalRepository.add(goalToAdd);
    expect(database.db.data!.goals.length).toEqual(3);
  });

  it("update - returns updated goal after successful update", async () => {
    const goal = goalRepository.getById("1");
    if (goal) {
      goal.wordCount = 5;
      const updatedGoal = await goalRepository.update(goal);
      expect(updatedGoal.wordCount).toBe(5);
      expect(updatedGoal.id).toEqual(goal.id);
    }
  });

  it("delete - returns void if goal deleted and progress deleted", async () => {
    const initialGoalCount = database.db.data!.goals.length;
    await goalRepository.delete("1");
    const postDeleteGoalCount = database.db.data!.goals.length;
    const postDeleteProgressCount = database.db.data!.progress.length;
    expect(postDeleteGoalCount).toEqual(initialGoalCount - 1);
    expect(postDeleteProgressCount).toEqual(1);
  });
});
