/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Type } from "interfaces";
import { Database, initializeDatabase } from "../database";
import TypeRepository from "./type-repository";
import TypeController from "./type-controller";
import type DataPath from "../data-path";

let database: Database;
let typeRepository: TypeRepository;
let typeController: TypeController;

describe("type-controller", () => {
  const typeSeedDate = new Date();

  beforeEach(async () => {
    const mockDataPath = {
      get: vi.fn(() => ""),
    } as any as DataPath;

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const initDb = await initializeDatabase(mockDataPath);
    database = new Database(initDb, mockDataPath);
    const seedDate = typeSeedDate;
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
    database.db.data!.projects = [
      {
        id: "1",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: seedDate,
        dateModified: seedDate,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: seedDate,
        dateModified: seedDate,
      },
    ];
    typeRepository = new TypeRepository(database);
    typeController = new TypeController(typeRepository);
  });

  it("getAll - returns all types sorted alphabetically", () => {
    expect(typeController.getAll()).toEqual([
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

  it("add - returns error when trying to add a type already in db", async () => {
    expect(await typeController.add("novel")).toEqual(
      new Error("Type is already in database")
    );
  });

  it("add - returns error if incorrect schema", async () => {
    expect(await typeController.add(999 as any as string)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("add - returns added, trimmed, and normalized type successfully", async () => {
    const addedType = await typeController.add("  NeW   ");
    expect((addedType as Type).value).toEqual("new");
    expect(addedType).toHaveProperty("id");
    expect(addedType).toHaveProperty("dateCreated");
  });

  it("delete - returns error if incorrect schema", async () => {
    expect(await typeController.delete(999 as any as string)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("delete - returns error when id not in database", async () => {
    expect(await typeController.delete("9000")).toEqual(
      new Error("Type not in database")
    );
  });

  it("delete - returns error when trying to delete a type linked to a project already in database", async () => {
    const response = await typeController.delete("1");
    expect(response).toEqual(
      new Error("Type cannot be deleted as projects are connected to this type")
    );
  });

  it("delete - returns true when deleting a type not connected to a project is successful", async () => {
    const originalTypeCount = (typeController.getAll() as Type[]).length;
    const response = await typeController.delete("6");
    const newTypeCount = (typeController.getAll() as Type[]).length;
    expect(response).toEqual(true);
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
