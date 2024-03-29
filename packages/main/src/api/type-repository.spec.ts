/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type DataPath from "../data-path";
import { Database, initializeDatabase } from "../database";
import TypeRepository from "./type-repository";

describe("type-repository", () => {
  let typeRepository: TypeRepository;
  const typeSeedDate = new Date();

  beforeEach(async () => {
    const mockDataPath = {
      get: vi.fn(() => ""),
    } as any as DataPath;

    vi.spyOn(console, "log").mockImplementation(() => {});

    const initDb = await initializeDatabase(mockDataPath);
    const database = new Database(initDb, mockDataPath);
    typeRepository = new TypeRepository(database);
    database.db.data!.types = [
      {
        id: "1",
        value: "novel",
        dateCreated: typeSeedDate,
      },
      {
        id: "2",
        value: "novella",
        dateCreated: typeSeedDate,
      },
      {
        id: "3",
        value: "memoir",
        dateCreated: typeSeedDate,
      },
      {
        id: "4",
        value: "short story",
        dateCreated: typeSeedDate,
      },
      {
        id: "5",
        value: "short story collection",
        dateCreated: typeSeedDate,
      },
      {
        id: "6",
        value: "poem",
        dateCreated: typeSeedDate,
      },
      {
        id: "7",
        value: "poetry collection",
        dateCreated: typeSeedDate,
      },
    ];
  });

  it("getAll - returns all types sorted alphabetically", () => {
    const types = typeRepository.getAll();
    expect(types).toEqual([
      {
        id: "3",
        value: "memoir",
        dateCreated: typeSeedDate,
      },
      {
        id: "1",
        value: "novel",
        dateCreated: typeSeedDate,
      },
      {
        id: "2",
        value: "novella",
        dateCreated: typeSeedDate,
      },
      {
        id: "6",
        value: "poem",
        dateCreated: typeSeedDate,
      },
      {
        id: "7",
        value: "poetry collection",
        dateCreated: typeSeedDate,
      },
      {
        id: "4",
        value: "short story",
        dateCreated: typeSeedDate,
      },
      {
        id: "5",
        value: "short story collection",
        dateCreated: typeSeedDate,
      },
    ]);
  });

  it("getByValue - returns undefined if type is not in database", () => {
    expect(typeRepository.getByValue("non-fiction")).toEqual(undefined);
  });

  it("getByValue - returns type if it's in database", () => {
    expect(typeRepository.getByValue("short story")).toEqual({
      id: "4",
      value: "short story",
      dateCreated: typeSeedDate,
    });
  });

  it("checkForTypeTaken - returns empty array if no projects by type", () => {
    expect(typeRepository.checkForTypeTaken("1")).toEqual([]);
  });

  it("add - returns added type when successful", async () => {
    const originalTypeCount = typeRepository.getAll().length;
    const addedType = await typeRepository.add("non-fiction");
    const newTypeCount = typeRepository.getAll().length;
    expect(addedType).toHaveProperty("id");
    expect(addedType).toHaveProperty("dateCreated");
    expect(addedType.value).toEqual("non-fiction");
    expect(newTypeCount).toEqual(originalTypeCount + 1);
  });

  it("delete - deletes type", async () => {
    const originalTypeCount = typeRepository.getAll().length;
    await typeRepository.delete("1");
    const newTypeCount = typeRepository.getAll().length;
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
