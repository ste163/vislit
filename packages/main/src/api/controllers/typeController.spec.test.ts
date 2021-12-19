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

  it("returns error when get all types fails", () => {});

  it("returns all types sorted alphabetically", () => {});

  it("returns error when trying to add a type already in db", () => {});

  it("returns error when adding type fails", () => {});

  it("returns added type successfully", () => {});

  it("returns error when trying to delete type by id not in database", () => {});

  it("returns error when deleting type fails", () => {});

  it("returns true when deleting is successful", () => {});
});
