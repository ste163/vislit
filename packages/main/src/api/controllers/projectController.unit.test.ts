/**
 * @jest-environment node
 */
import type { Project } from "interfaces";
import type ProjectRepository from "../repositories/projectRepository";
import type SearchController from "./searchController";
import type FileSystemController from "./fileSystemController";
import ProjectController from "./projectController";
// No unit tests for getAllProjects, not enough controller logic exists to check

const PROJECT: Project = {
  id: "1",
  title: "It",
  description: "A murderous clown attacks a town",
  typeId: 1,
  completed: false,
  archived: false,
  dateCreated: null,
  dateModified: null,
};

const PROJECTS: Project[] = [
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
    description: "An evil hotel possesses a groundskeeper",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  },
];

describe("project-controller-unit", () => {
  beforeAll(() => {
    // Disables the console.error messages jest displays in catch blocks
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns error when getting all projects", () => {
    const mockProjectRepository = {
      getAll: jest.fn(() => {
        throw new Error();
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.getAll()).toEqual(new Error());
  });

  it("returns all projects", () => {
    const mockProjectRepository = {
      getAll: jest.fn(() => PROJECTS),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.getAll()).toEqual(PROJECTS);
  });

  it("returns error when get by id fails", () => {
    const mockProjectRepository = {
      getById: jest.fn((id: string) => undefined),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.getById("123")).toEqual(
      new Error("Project with id 123 not in database")
    );
  });

  it("returns project by id", () => {
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.getById("1")).toEqual(PROJECT);
  });

  it("returns duplicate title error when adding project with title already in db", () => {
    const mockProjectRepository = {
      getByTitle: jest.fn(() => PROJECT),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.add(PROJECT)).toEqual(
      new Error("Project title already in database")
    );
  });

  it("returns error when add project fails", () => {
    const mockProjectRepository = {
      getByTitle: jest.fn(() => undefined),
      add: jest.fn(() => {
        throw new Error();
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.add(PROJECT)).toEqual(new Error());
  });

  it("adds project to database and returns the project", () => {
    const mockProjectRepository = {
      getByTitle: jest.fn(() => undefined),
      add: jest.fn(() => PROJECT),
    };
    const mockSearchController = {
      addProject: jest.fn(() => undefined),
    };
    const mockFileSystemController = {
      makeProjectDirectory: jest.fn(() => undefined),
    };

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.add(PROJECT)).toEqual(PROJECT);
  });

  it("returns error if updating a project with id not in database", () => {
    const mockProjectRepository = {
      getById: jest.fn((id) => {
        throw new Error(`Project with id ${id} not in database`);
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.update(PROJECT)).toEqual(
      new Error("Project with id 1 not in database")
    );
  });

  it("returns duplicate title error when attempting to update project to a title already in db", () => {
    const updatedProject = { ...PROJECT };
    updatedProject.title = "NEW TITLE";
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
      getByTitle: jest.fn(() => PROJECT),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.update(updatedProject)).toEqual(
      new Error("Project title already in database")
    );
  });

  it("returns error when updating project fails", () => {
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
      getByTitle: jest.fn(() => PROJECT),
      update: jest.fn(() => {
        throw new Error();
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.update(PROJECT)).toEqual(new Error());
  });

  it("updates project and returns updated project", () => {
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
      getByTitle: jest.fn(() => PROJECT),
      update: jest.fn(() => PROJECT),
    };
    const mockSearchController = {
      updateProject: jest.fn(() => undefined),
    };
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.update(PROJECT)).toEqual(PROJECT);
  });

  it("returns error if project to delete is not in database", () => {
    const mockProjectRepository = {
      getById: jest.fn((id) => {
        throw new Error(`Project with id ${id} not in database`);
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.delete(PROJECT.id)).toEqual(
      new Error("Project not in database")
    );
  });

  it("returns error if deleting project fails", () => {
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
      delete: jest.fn(() => {
        throw new Error();
      }),
    };
    const mockSearchController = null;
    const mockFileSystemController = null;

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.delete(PROJECT.id)).toEqual(new Error());
  });

  it("returns true if project was deleted", () => {
    const mockProjectRepository = {
      getById: jest.fn(() => PROJECT),
      delete: jest.fn(() => undefined),
    };
    const mockSearchController = {
      deleteProject: jest.fn(() => undefined),
    };
    const mockFileSystemController = {
      deleteProjectDirectory: jest.fn(() => undefined),
    };

    const projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      mockSearchController as unknown as SearchController,
      mockFileSystemController as unknown as FileSystemController
    );

    expect(projectController.delete(PROJECT.id)).toEqual(true);
  });
});
