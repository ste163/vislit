/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Project } from "interfaces";
import type FileSystemController from "./file-system-controller";
import type DataPath from "../data-path";
import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import ProjectController from "./project-controller";
import ProjectRepository from "./project-repository";

// TODO:
// add failure test for makeProjectDirectory
// add failure test for deleteProjectDirectory

describe("project-controller", () => {
  let seedData: Project[];
  let database: Database;
  let projectRepository: ProjectRepository;
  let searchController: SearchController;
  let projectController: ProjectController;

  beforeEach(async () => {
    const mockDataPath = {
      get: vi.fn(() => ""),
    } as any as DataPath;

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const initDb = await initializeDatabase(mockDataPath);
    database = new Database(initDb, mockDataPath);
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

  it("getAll - returns all projects", () => {
    expect(projectController.getAll()).toEqual(seedData);
  });

  it("getById - returns error if incorrect schema", async () => {
    expect(await projectController.getById(231 as any)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("getById - returns error if getting project by id is not in db", () => {
    expect(projectController.getById("300")).toEqual(
      new Error("Project with id 300 not in database")
    );
  });

  it("getById - returns project by id and can search for id by title", () => {
    const searchResult = searchController.searchProjects("it") as any;
    expect(projectController.getById("1")).toEqual(seedData[0]);
    expect(searchResult[0].title).toBe("It");
  });

  it("add - returns error if incorrect schema", async () => {
    expect(
      await projectController.add({
        description: "A murderous clown attacks a town",
        typeId: "2",
      } as any)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("add - returns duplicate title error if adding a project with a title already in db", async () => {
    expect(
      await projectController.add({
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: "2",
      })
    ).toEqual(new Error("Project title already in database"));
  });

  it("add - returns trimmed project and is searchable after adding", async () => {
    const projectToAdd = {
      title: "    The Dark Half  ",
      description: "  An evil pseudonym comes to life    ",
      typeId: "2",
    };

    const response = (await projectController.add(
      projectToAdd as Project
    )) as Project;

    const searchResult = searchController.searchProjects("dark half") as any;

    expect(response.title).toEqual("The Dark Half");
    expect(response.description).toEqual("An evil pseudonym comes to life");
    expect(searchResult[0].title).toEqual("The Dark Half");
  });

  it("update - returns error if incorrect schema", async () => {
    const updatedProject = {
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: "2",
      completed: false,
      archived: false,
    };

    expect(await projectController.update(updatedProject as any)).toEqual(
      new Error("Request does not match schema")
    );
  });

  it("update - returns error if updating project with id not in db", async () => {
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

  it("update - returns error if updating project with new title already in db", async () => {
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

  it("update - returns updated, trimmed project and updated project is searchable", async () => {
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
    const searchResult = searchController.searchProjects("revised") as any;

    expect(response.title).toEqual("It - revised");
    expect(response.description).toEqual(
      "A group of kids, and later as adults, fight evil"
    );
    expect(searchResult[0].title).toEqual("It - revised");
  });

  it("delete - returns error if incorrect schema", async () => {
    expect(await projectController.delete(999 as any as string)).toBeInstanceOf(
      Error
    );
  });

  it("delete - returns error if project is not in db", async () => {
    expect(await projectController.delete("4")).toEqual(
      new Error("Project not in database")
    );
  });

  it("delete - returns true and project is no longer searchable", async () => {
    const response = await projectController.delete("2");
    const searchResult = searchController.searchProjects("shining");

    expect(response).toBe(true);
    expect(searchResult).toEqual([]);
  });
});
