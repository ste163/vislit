/**
 * @jest-environment node
 */
import IProject from "@/interfaces/IProject";
import IProjectRepository from "../interfaces/IProjectRepository";
import ProjectController from "./projectController";
// No unit tests for getAllProjects
// not enough controller logic exists to check

beforeEach(() => {
  // Disables the console.error messages jest displays in catch blocks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("can add project", () => {
  const projectRepository = {
    getByTitle: jest.fn(() => undefined),
    add: jest.fn((project) => project),
  };

  // const searchController = {
  //   addProject: jest.fn(() => true),
  // };

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const project: IProject = {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  expect(projectController.add(project)).toEqual({
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  });
});

test("trying to add project with same name returns error", () => {
  const projectRepository = {
    getByTitle: jest.fn((project) => project), // causes error to be thrown
  };

  // const searchController = {
  //   addProject: jest.fn(() => true),
  // };

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const project = {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  expect(projectController.add(project)).toEqual(
    new Error("Project title already in database")
  );
});

test("can update project", () => {
  const projectRepository = {
    getById: jest.fn(() => {
      return {
        id: "1",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: null,
        dateModified: null,
      };
    }),
    getByTitle: jest.fn(() => undefined),
    update: jest.fn((project) => project),
  };

  // const searchController = {
  //   updateProject: jest.fn(() => {}),
  // };

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const project = {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  // Cannot do deep equality check as the dateModified becomes the new Date().
  // Two new Date()'s will never be the same time
  expect(projectController.update(project)).toHaveProperty("title", "It");
});

test("trying to update project with id not in database returns error", () => {
  const projectRepository = {
    getById: jest.fn(() => undefined),
  };

  // const searchController = {};

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const project = {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  expect(projectController.update(project)).toEqual(
    new Error(`Project with id 1 not in database`)
  );
});

test("trying to update project with title already in database returns error", () => {
  const projectRepository = {
    getById: jest.fn(() => {
      return {
        id: "1",
        title: "It",
        description: "A murderous clown attacks a town",
      };
    }),
    getByTitle: jest.fn((project) => project),
  };

  // const searchController = {};

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const project = {
    id: "1",
    title: "It",
    description: "A murderous clown attacks a town",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  expect(projectController.update(project)).toEqual(
    new Error("Project title already in database")
  );
});

test("can delete project", () => {
  const projectRepository = {
    getById: jest.fn((id) => id),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    delete: jest.fn(() => {}),
  };

  // const searchController = {
  //   removeProject: jest.fn(() => {}),
  // };

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  const success = projectController.delete("1");

  expect(success).toEqual(true);
});

test("trying to delete project with id not in database returns error", () => {
  const projectRepository = {
    getById: jest.fn(() => undefined),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    delete: jest.fn(() => {}),
  };

  // const searchController = {
  //   removeProject: jest.fn(() => {}),
  // };

  const projectController = new ProjectController(
    projectRepository as unknown as IProjectRepository
    // searchController
  );

  projectController.delete("100");

  expect(projectController.delete("100")).toEqual(
    new Error("Project not in database")
  );
});
