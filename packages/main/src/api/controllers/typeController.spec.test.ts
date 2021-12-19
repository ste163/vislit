/**
 * @jest-environment node
 */
import type { Type } from "interfaces";
import Database from "../database";
import TypeRepository from "../repositories/typeRepository";
import TypeController from "./typeController";

let seedData: Type[];
let database: Database;
let typeRepository: TypeRepository;
let typeController: TypeController;

describe("type-controller-integration", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    seedData = [
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

    database.db.data!.types = seedData;
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
    expect(typeController.add({ value: "novel" })).toEqual(
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
    expect(typeController.add({ value: "new" })).toEqual(new Error());
  });

  it("returns added type successfully", () => {
    const addedType = typeController.add({ value: "new" }) as Type;
    expect(addedType.value).toEqual("new");
    expect(addedType).toHaveProperty("id");
  });

  it("returns error when trying to delete type by id not in database", () => {
    expect(typeController.delete("9000")).toEqual(
      new Error("Type not in database")
    );
  });

  it("returns error when deleting type fails", () => {
    const mockTypeRepository = {
      getAll: jest.fn(() => seedData),
      delete: jest.fn(() => {
        throw new Error();
      }),
    } as unknown as TypeRepository;
    typeController = new TypeController(mockTypeRepository);
    expect(typeController.delete("1")).toEqual(new Error());
  });

  it("returns true when deleting is successful", () => {
    const originalTypeCount = (typeController.getAll() as Type[]).length;
    const response = typeController.delete("1");
    const newTypeCount = (typeController.getAll() as Type[]).length;
    expect(response).toEqual(true);
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
