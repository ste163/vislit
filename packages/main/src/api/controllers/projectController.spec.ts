/**
 * @jest-environment node
 */
import Database from "../database";
import ProjectController from "./projectController";
import ProjectRepository from "../repositories/projectRepository";
import SearchController from "./searchController";
import type { Project } from "interfaces";
import type FileSystemController from "./fileSystemController";

let seedData: Project[];
let database: Database;
let projectRepository: ProjectRepository;
let searchController: SearchController;
let projectController: ProjectController;
let fileSystemController: FileSystemController;

describe("project-controller-integration", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    const seedDate = new Date();
    seedData = [
      {
        id: "1",    
        title: "It",       
        description: "A murderous clown attacks a town",  
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: seedDate,
        dateModified: seedDate,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: seedDate,
        dateModified: seedDate,
      },
    ];

    if (database.db.data !== null) {
      database.db.data.projects = seedData;
    }

    projectRepository = new ProjectRepository(database);
    searchController = new SearchController(projectRepository);
    const mockFileSystemController = {
      makeProjectDirectory: jest.fn(() => undefined),
      deleteProjectDirectory: jest.fn(() => undefined),
    } as unknown as FileSystemController;
    projectController = new ProjectController(
      projectRepository,
      searchController,
      mockFileSystemController
    );
  });

  it("returns error when getting all projects", () => {
    const mockProjectRepository = {
      getAll: jest.fn(() => {
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
      getById: jest.fn(() => {
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

  it("returns duplicate title error if adding a project with a title already in db", () => {
    expect(
      projectController.add({
        id: "",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: null,
        dateModified: null,
      })
    ).toEqual(new Error("Project title already in database"));
  });

  it("returns error when adding project fails", () => {
    const mockProjectRepository = {
      add: jest.fn(() => {
        throw new Error();
      }),
      getByTitle: jest.fn(() => undefined),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(
      projectController.add({
        id: "",
        title: "It",
        description: "A murderous clown attacks a town",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: null,
        dateModified: null,
      })
    ).toEqual(new Error());
  });

  it("returns project and is searchable after adding", () => {
    const projectToAdd = {
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: null,
      dateModified: null,
    };

    const response = projectController.add(projectToAdd as Project) as Project;

    const searchResult = searchController.searchProjects("dark half");

    expect(response.title).toEqual("The Dark Half");
    expect(searchResult[0].title).toEqual("The Dark Half");
  });

  it("returns error if updating project with id not in db", () => {
    const updatedProject = {
      id: "5",
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: new Date(),
      dateModified: new Date(),
    };

    expect(projectController.update(updatedProject)).toEqual(
      new Error("Project with id 5 not in database")
    );
  });

  it("returns error if updating project with new title already in db", () => {
    const updatedProject = {
      id: "1",
      title: "The Shining",
      description: "An evil pseudonym comes to life",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: new Date(),
      dateModified: new Date(),
    };

    expect(projectController.update(updatedProject)).toEqual(
      new Error("Project title already in database")
    );
  });

  it("returns error if updating project fails", () => {
    const projectToUpdate = {
      id: "1",
      title: "The Dark Half",
      description: "An evil pseudonym comes to life",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: new Date(),
      dateModified: new Date(),
    };

    const mockProjectRepository = {
      update: jest.fn(() => {
        throw new Error();
      }),
      getById: jest.fn(() => projectToUpdate),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(projectController.update(projectToUpdate)).toEqual(new Error());
  });

  it("returns updated project and updated project is searchable", () => {
    const projectToUpdate = {
      id: "1",
      title: "It - revised",
      description: "A group of kids, and later as adults, fight evil",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: new Date(),
      dateModified: new Date(),
    };

    const response = projectController.update(projectToUpdate) as Project;
    const searchResult = searchController.searchProjects("revised");

    expect(response.title).toEqual("It - revised");
    expect(searchResult[0].title).toEqual("It - revised");
  });

  it("returns error if project to delete is not in db", () => {
    expect(projectController.delete("4")).toEqual(
      new Error("Project not in database")
    );
  });

  it("returns error if project delete fails", () => {
    const mockProjectRepository = {
      delete: jest.fn(() => {
        throw new Error();
      }),
      getById: jest.fn(() => seedData[0]),
    };

    projectController = new ProjectController(
      mockProjectRepository as unknown as ProjectRepository,
      searchController,
      fileSystemController
    );

    expect(projectController.delete("1")).toEqual(new Error());
  });

  it("returns true and project is no longer searchable on delete", () => {
    const response = projectController.delete("2");
    const searchResult = searchController.searchProjects("shining");

    expect(response).toEqual(true);
    expect(searchResult).toEqual([]);
  });
});
