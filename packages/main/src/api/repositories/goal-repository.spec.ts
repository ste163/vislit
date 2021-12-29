import type { Goal } from "interfaces";
import Database from "../database";
import GoalRepository from "./goal-repository";

describe("goal-repository", () => {
  let goalRepository: GoalRepository;
  let database: Database;

  beforeEach(() => {
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    goalRepository = new GoalRepository(database);
  });

  //   it("returns undefined if no goal by id founds", () => {});

  //   it("returns goal by id", () => {});

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
    expect(database.db.data?.goals.length).toEqual(1);
  });

  //   it("returns error if goal to delete not found", () => {});

  //   it("returns void if goal deleted", () => {});
});
