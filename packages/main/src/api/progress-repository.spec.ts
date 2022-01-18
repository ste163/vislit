/**
 * @jest-environment node
 */
import type { Progress } from "interfaces";
import Database from "../database";
import ProgressRepository from "./progress-repository";

describe("progress-repository", () => {
  let database: Database;
  let progressRepository: ProgressRepository;
  const seedDate = new Date().toISOString();
  const seedDate2 = new Date("2020-01-01").toISOString();
  const seedDate3 = new Date("2020-01-15").toISOString();

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
      {
        date: seedDate2,
        projectId: "1",
        goalId: "2",
        count: 500,
        edited: false,
        proofread: true,
        revised: false,
      },
      {
        date: seedDate3,
        projectId: "1",
        goalId: "3",
        count: 300,
        edited: false,
        proofread: false,
        revised: true,
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

  it("returns empty array if no get all progress by projectId exists", () => {
    expect(
      progressRepository.getAllByYearMonth("0", "2020", "01")
    ).toHaveLength(0);
  });

  it("returns empty array if no progress by year or month exists", () => {
    expect(
      progressRepository.getAllByYearMonth("1", "1995", "01")
    ).toHaveLength(0);
  });

  it("returns all progress by year and month", () => {
    expect(
      progressRepository.getAllByYearMonth("1", "2020", "01")
    ).toHaveLength(2);
  });

  it("returns added progress", () => {});

  it("returns updated progress", () => {});

  it("returns void after deleting progress", () => {});
});
