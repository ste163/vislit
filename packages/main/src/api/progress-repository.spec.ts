/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Progress } from "interfaces";
import { Database, initializeDatabase } from "../database";
import ProgressRepository from "./progress-repository";

describe("progress-repository", () => {
  let database: Database;
  let progressRepository: ProgressRepository;
  const seedDate = new Date().toISOString();
  const seedDate2 = new Date("2020-01-01").toISOString();
  const seedDate3 = new Date("2020-01-15").toISOString();

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    progressRepository = new ProgressRepository(database);
    const seedProgress: Progress[] = [
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
      {
        date: seedDate2,
        projectId: "2", // same date for 2 projects
        goalId: "1",
        count: 600,
        edited: true,
        proofread: false,
        revised: true,
      },
    ];
    database.db.data!.progress = seedProgress;
  });

  it("returns undefined if date not found", () => {
    expect(
      progressRepository.getByDate("1", new Date("1999-01-01").toISOString())
    ).toBeUndefined();
  });

  it("returns progress if projectId and date found", () => {
    expect(progressRepository.getByDate("1", seedDate)).toEqual({
      date: seedDate,
      projectId: "1",
      goalId: "1",
      count: 250,
      edited: false,
      proofread: false,
      revised: false,
    });
  });

  it("returns empty array if no progress by year or month exists", () => {
    expect(
      progressRepository.getAllByYearMonth("1", "1995", "01")
    ).toHaveLength(0);
  });

  it("returns all progress by projectId, year, and month", () => {
    expect(
      progressRepository.getAllByYearMonth("1", "2020", "01")
    ).toHaveLength(2);
  });

  it("returns added progress", async () => {
    const seedDate4 = new Date("2020-01-16").toISOString();
    const newProgress: Progress = {
      date: seedDate4,
      projectId: "1",
      goalId: "4",
      count: 500,
      edited: false,
      proofread: false,
      revised: false,
    };
    const originalCount = database.db.data!.progress.length;
    const addedProgress = await progressRepository.add(newProgress);
    const postCount = database.db.data!.progress.length;
    expect(originalCount + 1).toEqual(postCount);
    expect(addedProgress).toEqual(newProgress);
  });

  it("returns updated progress", async () => {
    const progressToUpdate: Progress = {
      date: seedDate2,
      projectId: "1",
      goalId: "2",
      count: 100,
      edited: true,
      proofread: true,
      revised: true,
    };
    const originalCount = database.db.data!.progress.length;
    const updatedProgress = await progressRepository.update(progressToUpdate);
    const postCount = database.db.data!.progress.length;
    expect(originalCount).toEqual(postCount);
    expect(updatedProgress).toEqual(progressToUpdate);
  });

  it("returns void after deleting progress", async () => {
    const originalCount = database.db.data!.progress.length;
    await progressRepository.delete("1", seedDate3);
    const postCount = database.db.data!.progress.length;
    expect(originalCount - 1).toEqual(postCount);
    database.db.data!.progress.forEach((progress) => {
      expect(progress.date).not.toEqual(seedDate3);
    });
  });
});
