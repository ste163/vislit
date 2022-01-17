/**
 * @jest-environment node
 */
import type { Progress } from "interfaces";
import Database from "../database";
import ProgressRepository from "./progress-repository";

describe("progress-repository", () => {
  let database: Database;
  let progressRepository: ProgressRepository;
  const seedDate = new Date();

  beforeEach(() => {
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    progressRepository = new ProgressRepository(database);
    const seedProgess: Progress[] = [
      {
        date: seedDate,
        projectId: "1",
        goalId: "1",
        count: 250,
        edited: false,
        proofread: false,
        revised: false,
      },
    ];

    database.db.data!.progress = seedProgess;
  });

  it("returns undefined if date not found", () => {
    expect(progressRepository.getByDate(new Date())).toBeUndefined();
  });

  it("returns progress if date found", () => {
    expect(progressRepository.getByDate(seedDate)).toEqual({
      date: seedDate,
      projectId: "1",
      goalId: "1",
      count: 250,
      edited: false,
      proofread: false,
      revised: false,
    });
  });

  it("returns added progress", () => {});

  it("returns updated progress", () => {});

  it("returns void after deleting progress", () => {});
});
