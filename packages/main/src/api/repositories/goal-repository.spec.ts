import type { Goal } from "interfaces";
import Database from "../database";
import GoalRepository from "./goal-repository";

describe("goal-repository", () => {
  let seedGoal: Goal;
  let database: Database;
  let goalRepository: GoalRepository;

  beforeEach(() => {
    const { app } = jest.requireMock("electron");
    seedGoal = {
      id: "1",
      projectId: "2",
      basedOnWordCountOrPageCount: "word",
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    database = new Database(app);
    database.db.data?.goals.push(seedGoal);
    goalRepository = new GoalRepository(database);
  });

  it("returns undefined if no goal by id founds", () => {
    expect(goalRepository.getGoalById("999")).toBeUndefined();
  });

  it("returns goal by id", () => {
    expect(goalRepository.getGoalById("1")).toEqual({
      id: "1",
      projectId: "2",
      basedOnWordCountOrPageCount: "word",
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    });
  });

  it("returns goal after added to database", () => {
    const goalToAdd: Goal = {
      projectId: "1",
      basedOnWordCountOrPageCount: "word",
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
    };
    goalRepository.add(goalToAdd);
    expect(database.db.data?.goals.length).toEqual(2);
  });

  //   it("returns error if goal to delete not found", () => {});

  //   it("returns void if goal deleted", () => {});
});
