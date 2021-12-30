import type { Goal, Project } from "interfaces";
import Database from "../database";
import GoalRepository from "./goal-repository";

describe("goal-repository", () => {
  let seedProjects: Project[];
  let seedGoal: Goal;
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
    seedGoal = {
      id: "1",
      projectId: "2",
      basedOnWordCountOrPageCount: "word",
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    };
    database = new Database(app);
    database.db.data!.projects = seedProjects;
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
      wordOrPageCount: 500,
      frequencyToRepeat: "daily",
      proofreadCountsTowardGoal: true,
      editCountsTowardGoal: true,
      revisedCountsTowardsGoal: true,
      active: true,
      completed: false,
    });
  });

  it("returns empty array if no goals with that projectId", () => {
    expect(goalRepository.getActiveGoal("999")).toEqual([]);
  });

  it("returns empty array if projectId in database but no active goals", () => {
    expect(goalRepository.getActiveGoal("1")).toEqual([]);
  });

  it("returns active goals by projectId", () => {
    const goal = goalRepository.getActiveGoal("2");
    expect(goal).toEqual([
      {
        id: "1",
        projectId: "2",
        basedOnWordCountOrPageCount: "word",
        wordOrPageCount: 500,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ]);
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
    expect(database.db.data?.goals.length).toEqual(2);
  });

  it("returns updated goal after successful update", () => {
    const goal = goalRepository.getGoalById("1");
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
