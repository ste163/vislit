/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Project, Type } from "interfaces";
import { Database, initializeDatabase } from "../database";
import TypeRepository from "./type-repository";
import TypeController from "./type-controller";
import { ZodError } from "zod";

let typeSeedData: Type[];
let projectSeedData: Project[];
let database: Database;
let typeRepository: TypeRepository;
let typeController: TypeController;

describe("type-controller-integration", () => {
  const typeSeedDate = new Date();

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    typeSeedData = [
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
    const seedDate = typeSeedDate;
    projectSeedData = [
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

    database.db.data!.types = typeSeedData;
    database.db.data!.projects = projectSeedData;
    typeRepository = new TypeRepository(database);
    typeController = new TypeController(typeRepository);
  });

  it("returns error when get all types fails", () => {
    const mockTypeRepository = {
      getAll: vi.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(typeController.getAll()).toEqual(new Error());
  });

  it("returns all types sorted alphabetically", () => {
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

  it("returns error when trying to add a type already in db", async () => {
    expect(await typeController.add("novel")).toEqual(
      new Error("Type is already in database")
    );
  });

  it("returns error when adding type fails", async () => {
    const mockTypeRepository = {
      getByValue: vi.fn(() => undefined),
      add: vi.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(await typeController.add("new")).toEqual(new Error());
  });

  it("returns error when value doesn't match schema", async () => {
    expect(await typeController.add(999 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns added, trimmed, and normalized type successfully", async () => {
    const addedType = await typeController.add("  NeW   ");
    expect((addedType as Type).value).toEqual("new");
    expect(addedType).toHaveProperty("id");
    expect(addedType).toHaveProperty("dateCreated");
  });

  it("returns error when deleting doesn't match schema", async () => {
    expect(await typeController.delete(999 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns error when trying to delete type by id not in database", async () => {
    expect(await typeController.delete("9000")).toEqual(
      new Error("Type not in database")
    );
  });

  it("returns error when trying to delete a type linked to a project already in database", async () => {
    const response = await typeController.delete("1");
    expect(response).toEqual(
      new Error("Type cannot be deleted as projects are connected to this type")
    );
  });

  it("returns error when deleting type fails", async () => {
    const mockTypeRepository = {
      getAll: vi.fn(() => typeSeedData),
      checkForTypeTaken: vi.fn(() => undefined),
      delete: vi.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(await typeController.delete("1")).toEqual(new Error());
  });

  it("returns true when deleting a type not connected to a project is successful", async () => {
    const originalTypeCount = (typeController.getAll() as Type[]).length;
    const response = await typeController.delete("6");
    const newTypeCount = (typeController.getAll() as Type[]).length;
    expect(response).toEqual(true);
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
