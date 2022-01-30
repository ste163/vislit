/**
 * @jest-environment node
 */
import type { Project, Note } from "interfaces";
import Database from "../database";
import SearchController from "./search-controller";
import type FileSystemController from "./file-system-controller";
import ProjectRepository from "./project-repository";
import NoteRepository from "./note-repository";
import NoteController from "./note-controller";

describe("project-controller-integration", () => {
  let seedProjects: Project[];
  let seedNotes: Note[];
  let database: Database;
  let projectRepository: ProjectRepository;
  let noteRepository: NoteRepository;
  let searchController: SearchController;
  let noteController: NoteController;
  let fileSystemController: FileSystemController;
  const seedDate = new Date();

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    seedProjects = [
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
    seedNotes = [
      {
        id: "1",
        projectId: "1",
        title: "First Note",
        dateCreated: seedDate,
        dateModified: seedDate,
      },
      {
        id: "2",
        projectId: "1",
        title: "Second Note",
        dateCreated: seedDate,
        dateModified: seedDate,
      },
    ];

    database.db.data!.projects = seedProjects;
    database.db.data!.notes = seedNotes;
    projectRepository = new ProjectRepository(database);
    noteRepository = new NoteRepository(database);
    searchController = new SearchController(projectRepository, noteRepository);
    const mockFileSystemController = {
      // Change these mocks later
      makeProjectDirectory: jest.fn(() => undefined),
      deleteProjectDirectory: jest.fn(() => undefined),
    } as unknown as FileSystemController;
    noteController = new NoteController(
      noteRepository,
      searchController,
      mockFileSystemController
    );
  });

  it("returns empty array if no notes found for that projectId", () => {
    expect(noteController.getAllByProjectId("999")).toStrictEqual([]);
  });

  it("returns notes by projectId", () => {
    expect(noteController.getAllByProjectId("1")).toEqual(seedNotes);
  });

  it("returns error if note by id not in database", () => {
    expect(noteController.getById("999")).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns note by id", () => {
    expect(noteController.getById("2")).toEqual({
      id: "2",
      projectId: "1",
      title: "Second Note",
      dateCreated: seedDate,
      dateModified: seedDate,
    });
  });
});
