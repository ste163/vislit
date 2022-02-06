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
      readNoteById: jest.fn(() => undefined),
      deleteNote: jest.fn(() => undefined),
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
      html: null,
      dateCreated: seedDate,
      dateModified: seedDate,
    });
  });

  it("returns error if trying to add note with a title and projectId already in database", () => {
    const note: Note = {
      projectId: "1",
      title: "First Note",
      dateCreated: seedDate,
      dateModified: seedDate,
    };

    expect(noteController.add(note)).toEqual(
      new Error("Note title already in database")
    );
  });

  it("returns note and is searchable after adding", () => {
    const note: Note = {
      projectId: "1",
      title: "  Newest Note   ",
    };

    const originalCount = database.db.data!.notes.length;
    const response = noteController.add(note);
    const newCount = database.db.data!.notes.length;
    const searchResult = searchController.searchNotes(response.title);

    expect(originalCount + 1).toEqual(newCount);
    expect(response).toHaveProperty("id");
    expect(response.title).toEqual("Newest Note");
    expect(searchResult[0].title).toBe("Newest Note");
  });

  it("returns error if trying to update note by id not in db", () => {
    const note: Note = {
      id: "999",
      projectId: "1",
      title: "First Note",
    };

    expect(noteController.update(note)).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns error if trying to update note with title already in db", () => {
    const note: Note = {
      id: "2",
      projectId: "1",
      title: "First Note",
    };

    expect(noteController.update(note)).toEqual(
      new Error("Note title already in database")
    );
  });

  it("returns updated searchable note after update", () => {
    const note: Note = {
      id: "2",
      projectId: "1",
      title: "Updated Second Note",
    };

    const originalCount = database.db.data!.notes.length;
    const response = noteController.update(note);
    const newCount = database.db.data!.notes.length;
    const searchResult = searchController.searchNotes(response.title);

    expect(originalCount).toEqual(newCount);
    expect(response.title).toEqual("Updated Second Note");
    expect(searchResult[0].title).toEqual("Updated Second Note");
  });

  it("returns error if trying to delete note by id not in database", () => {
    expect(noteController.delete("999")).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns true and note no longer searchable after delete", () => {
    const response = noteController.delete("2");
    const searchResult = searchController.searchNotes("second");

    expect(response).toEqual(true);
    expect(searchResult).toEqual([]);
  });
});
