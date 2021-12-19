/**
 * @jest-environment node
 */

// getAll throws error
// can get all projects
// trying to add project with type in db throws error
// adding a new type that's not in db throws error
// can add new type
// trying to delete a project by id not in db throws error
// can delete type

import type { Type } from "interfaces";
import Database from "../database";
import type TypeRepository from "../repositories/typeRepository";
import type TypeController from "./typeController";

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
  });
});
