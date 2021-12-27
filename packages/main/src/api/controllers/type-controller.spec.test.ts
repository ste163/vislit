/**
 * @jest-environment node
 */
import type { Project, Type } from "interfaces";
import Database from "../database";
import TypeRepository from "../repositories/type-repository";
import TypeController from "./type-controller";

let typeSeedData: Type[];
let projectSeedData: Project[];
let database: Database;
let typeRepository: TypeRepository;
let typeController: TypeController;

describe("type-controller-integration", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    typeSeedData = [
      {
        id: "1",
        value: "novel",
      },
      {
        id: "2",
        value: "novella",
      },
      {
        id: "3",
        value: "memoir",
      },
      {
        id: "4",
        value: "short story",
      },
      {
        id: "5",
        value: "short story collection",
      },
      {
        id: "6",
        value: "poem",
      },
      {
        id: "7",
        value: "poetry collection",
      },
    ];
    const seedDate = new Date();
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
      getAll: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(typeController.getAll()).toEqual(new Error());
  });

  it("returns all types sorted alphabetically", () => {
    expect(typeController.getAll()).toEqual([
      { id: "3", value: "memoir" },
      { id: "1", value: "novel" },
      { id: "2", value: "novella" },
      { id: "6", value: "poem" },
      {
        id: "7",
        value: "poetry collection",
      },
      {
        id: "4",
        value: "short story",
      },
      {
        id: "5",
        value: "short story collection",
      },
    ]);
  });

  it("returns error when trying to add a type already in db", () => {
    expect(typeController.add("novel")).toEqual(
      new Error("Type is already in database")
    );
  });

  it("returns error when adding type fails", () => {
    const mockTypeRepository = {
      getByValue: jest.fn(() => undefined),
      add: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(typeController.add("new")).toEqual(new Error());
  });

  it("returns added type successfully", () => {
    const addedType = typeController.add("new");
    expect((addedType as Type).value).toEqual("new");
    expect(addedType).toHaveProperty("id");
  });

  it("returns error when trying to delete type by id not in database", () => {
    expect(typeController.delete("9000")).toEqual(
      new Error("Type not in database")
    );
  });

  it("returns error when trying to delete a type linked to a project already in database", () => {
    const response = typeController.delete("1");
    expect(response).toEqual(
      new Error("Type cannot be deleted as projects are connected to this type")
    );
  });

  it("returns error when deleting type fails", () => {
    const mockTypeRepository = {
      getAll: jest.fn(() => typeSeedData),
      checkForTypeTaken: jest.fn(() => undefined),
      delete: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(typeController.delete("1")).toEqual(new Error());
  });

  it("returns true when deleting a type not connected to a project is successful", () => {
    const originalTypeCount = (typeController.getAll() as Type[]).length;
    const response = typeController.delete("6");
    const newTypeCount = (typeController.getAll() as Type[]).length;
    expect(response).toEqual(true);
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
