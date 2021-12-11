/**
 * @jest-environment node
 */
import type { ProjectModel } from "interfaces";
import type ProjectRespositoryModel from "../interfaces/ProjectRespositoryModel";
import type SearchControllerModel from "../interfaces/SearchControllerModel";
import ProjectController from "./projectController";
// No unit tests for getAllProjects, not enough controller logic exists to check

const PROJECT: ProjectModel = {
  id: "1",
  title: "It",
  description: "A murderous clown attacks a town",
  typeId: 1,
  completed: false,
  archived: false,
  dateCreated: null,
  dateModified: null,
};

const PROJECTS: ProjectModel[] = [
  {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  },
  {
    id: "2",
    title: "The Shining",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  },
];

describe("project-controller", () => {
  beforeAll(() => {
    // Disables the console.error messages jest displays in catch blocks
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns error when getting all projects", () => {
    const mockProjectRespository = {
      getAll: jest.fn(() => {
        throw new Error();
      }),
    };
    const mockSearchController = null;

    const projectController = new ProjectController(
      mockProjectRespository as unknown as ProjectRespositoryModel,
      mockSearchController as unknown as SearchControllerModel
    );

    const error = new Error();

    expect(projectController.getAll()).toEqual(error);
  });

  it("returns all projects", () => {
    const mockProjectRespository = {
      getAll: jest.fn(() => PROJECTS),
    };
    const mockSearchController = null;

    const projectController = new ProjectController(
      mockProjectRespository as unknown as ProjectRespositoryModel,
      mockSearchController as unknown as SearchControllerModel
    );

    expect(projectController.getAll()).toEqual(PROJECTS);
  });

  it("returns error when get by id fails", () => {
    const mockProjectRespository = {
      getById: jest.fn((id: string) => undefined),
    };
    const mockSearchController = null;

    const projectController = new ProjectController(
      mockProjectRespository as unknown as ProjectRespositoryModel,
      mockSearchController as unknown as SearchControllerModel
    );

    const error = new Error("Project with id 123 not in database");

    expect(projectController.getById("123")).toEqual(error);
  });

  it("returns project by id", () => {
    const mockProjectRespository = {
      getById: jest.fn(() => PROJECT),
    };
    const mockSearchController = null;

    const projectController = new ProjectController(
      mockProjectRespository as unknown as ProjectRespositoryModel,
      mockSearchController as unknown as SearchControllerModel
    );

    expect(projectController.getById("1")).toEqual(PROJECT);
  });

  it("returns duplicate title error when adding project with title already in db", () => {});

  it("returns error when to add project fails", () => {});

  it("adds project to database and returns the project", () => {});

  it("returns duplicate title error when attempting to update project to a title already in db", () => {});

  it("returns error when updating project fails", () => {});

  it("updates project and returns updated project", () => {});

  it("returns error if project to delete is not in database", () => {});

  it("returns error if deleting project fails", () => {});

  it("returns true if project was deleted", () => {});
});
