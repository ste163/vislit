/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Project } from "interfaces";
import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import ProjectController from "./project-controller";
import ProjectRepository from "./project-repository";
import { ZodError } from "zod";
import type FileSystemController from "./file-system-controller";

// TODO:
// add failure test for makeProjectDirectory
// add failure test for deleteProjectDirectory

describe("project-controller-integration", () => {
  let seedData: Project[];
  let database: Database;
  let projectRepository: ProjectRepository;
  let searchController: SearchController;
  let projectController: ProjectController;
  let fileSystemController: FileSystemController;

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    const seedDate = new Date();
    seedData = [
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

    database.db.data!.projects = seedData;
    projectRepository = new ProjectRepository(database);
    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(database);
    searchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );
    const mockFileSystemController = {
      makeProjectDirectory: vi.fn(() => undefined),
      deleteProjectDirectory: vi.fn(() => undefined),
    } as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      searchController,
      mockFileSystemController
    );
  });

  it("returns error when getting all projects", () => {
    const mockProjectRepository = {
      getAll: vi.fn(() => {
        throw new Error();
      }),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(projectController.getAll()).toEqual(new Error());
  });

  it("returns all projects", () => {
    expect(projectController.getAll()).toEqual(seedData);
  });

  it("returns error if getting project by id is not in db", () => {
    expect(projectController.getById("300")).toEqual(
      new Error("Project with id 300 not in database")
    );
  });

  it("returns error if get by id fails", () => {
    const mockProjectRepository = {
      getById: vi.fn(() => {
        throw new Error();
      }),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(projectController.getById("20")).toEqual(new Error());
  });

  it("returns project by id and can search for id by title", () => {
    const searchResult = searchController.searchProjects("it");
    expect(projectController.getById("1")).toEqual(seedData[0]);
    expect(searchResult[0].title).toBe("It");
  });

  it("returns error if project doesn't match schema", async () => {
    expect(
      await projectController.add({
        description: "A murderous clown attacks a town",
        typeId: "2",
      } as any)
    ).toBeInstanceOf(ZodError);
  });

  it("returns duplicate title error if adding a project with a title already in db", async () => {
    expect(
      await projectController.add({
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: "2",
      })
    ).toEqual(new Error("Project title already in database"));
  });

  it("returns trimmed project and is searchable after adding", async () => {
    const projectToAdd = {
      title: "    The Dark Half  ",
      description: "  An evil pseudonym comes to life    ",
      typeId: "2",
    };

    const response = (await projectController.add(
      projectToAdd as Project
    )) as Project;

    const searchResult = searchController.searchProjects("dark half");

    expect(response.title).toEqual("The Dark Half");
    expect(response.description).toEqual("An evil pseudonym comes to life");
    expect(searchResult[0].title).toEqual("The Dark Half");
  });

  it("returns error if updating project that doesn't match schema", async () => {
    const updatedProject = {
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: "2",
      completed: false,
      archived: false,
    };

    expect(
      await projectController.update(updatedProject as any)
    ).toBeInstanceOf(ZodError);
  });

  it("returns error if updating project with id not in db", async () => {
    const updatedProject = {
      id: "5",
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: "2",
      completed: false,
      archived: false,
    };

    expect(await projectController.update(updatedProject)).toEqual(
      new Error("Project with id 5 not in database")
    );
  });

  it("returns error if updating project with new title already in db", async () => {
    const updatedProject = {
      id: "1",
      title: "The Shining",
      description: "An evil pseudonym comes to life",
      typeId: "2",
      completed: false,
      archived: false,
    };

    expect(await projectController.update(updatedProject)).toEqual(
      new Error("Project title already in database")
    );
  });

  it("returns error if updating project fails", async () => {
    const projectToUpdate = {
      id: "1",
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: "2",
      completed: false,
      archived: false,
    };

    const mockProjectRepository = {
      update: vi.fn(() => {
        throw new Error();
      }),
      getById: vi.fn(() => projectToUpdate),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(await projectController.update(projectToUpdate)).toEqual(
      new Error()
    );
  });

  it("returns updated, trimmed project and updated project is searchable", async () => {
    const projectToUpdate = {
      id: "1",
      title: "    It - revised      ",
      description: "    A group of kids, and later as adults, fight evil   ",
      typeId: "1",
      completed: false,
      archived: false,
    };

    const response = (await projectController.update(
      projectToUpdate
    )) as Project;
    const searchResult = searchController.searchProjects("revised");

    expect(response.title).toEqual("It - revised");
    expect(response.description).toEqual(
      "A group of kids, and later as adults, fight evil"
    );
    expect(searchResult[0].title).toEqual("It - revised");
  });

  it("returns error if projectId doesn't match schema", async () => {
    expect(await projectController.delete(999 as any as string)).toBeInstanceOf(
      Error
    );
  });

  it("returns error if project to delete is not in db", async () => {
    expect(await projectController.delete("4")).toEqual(
      new Error("Project not in database")
    );
  });

  it("returns error if project delete fails", async () => {
    const mockProjectRepository = {
      delete: vi.fn(() => {
        throw new Error();
      }),
      getById: vi.fn(() => seedData[0]),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(await projectController.delete("1")).toEqual(new Error());
  });

  it("returns true and project is no longer searchable on delete", async () => {
    const response = await projectController.delete("2");
    const searchResult = searchController.searchProjects("shining");

    expect(response).toEqual(true);
    expect(searchResult).toEqual([]);
  });
});
