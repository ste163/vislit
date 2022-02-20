/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import NoteRepository from "./note-repository";
import NoteController from "./note-controller";
import { ZodError } from "zod";
import type { Project, Note } from "interfaces";
import type FileSystemController from "./file-system-controller";
import type { updateNoteRequest } from "../schemas";

describe("project-controller-integration", () => {
  let seedProjects: Project[];
  let seedNotes: Note[];
  let database: Database;
  let noteRepository: NoteRepository;
  let searchController: SearchController;
  let noteController: NoteController;
  const seedDate = new Date();

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
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
    noteRepository = new NoteRepository(database);
    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(database);
    searchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );
    const mockFileSystemController = {
      readNoteById: vi.fn(() => undefined),
      deleteNote: vi.fn(() => undefined),
    } as unknown as FileSystemController;
    noteController = new NoteController(
      noteRepository,
      searchController,
      mockFileSystemController
    );
  });

  it("returns error if trying to get all notes with projectId that doesn't match schema", () => {
    expect(
      noteController.getAllByProjectId(123 as any as string)
    ).toBeInstanceOf(ZodError);
  });

  it("returns empty array if no notes found for that projectId", () => {
    expect(noteController.getAllByProjectId("999")).toStrictEqual([]);
  });

  it("returns notes by projectId", () => {
    expect(noteController.getAllByProjectId("1")).toEqual(seedNotes);
  });

  it("returns error if trying to get note with id that doesn't match schema", async () => {
    expect(await noteController.getById(123 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns error if note by id not in database", async () => {
    expect(await noteController.getById("999")).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns note by id", async () => {
    expect(await noteController.getById("2")).toEqual({
      id: "2",
      projectId: "1",
      title: "Second Note",
      html: null,
      dateCreated: seedDate,
      dateModified: seedDate,
    });
  });

  it("returns error if trying to add note that doesn't match schema", async () => {
    expect(
      await noteController.add({
        title: 342 as any as string,
        projectId: "232",
      })
    ).toBeInstanceOf(ZodError);
  });

  it("returns error if trying to add note with a title and projectId already in database", async () => {
    const note: Note = {
      projectId: "1",
      title: "First Note",
    };

    expect(await noteController.add(note)).toEqual(
      new Error("Note title already in database")
    );
  });

  it("returns note and is searchable after adding", async () => {
    const note: Note = {
      projectId: "1",
      title: "  Newest Note   ",
    };

    const originalCount = database.db.data!.notes.length;
    const response = (await noteController.add(note)) as Note;
    const newCount = database.db.data!.notes.length;
    const searchResult = searchController.searchNotes(response.title);

    expect(originalCount + 1).toEqual(newCount);
    expect(response).toHaveProperty("id");
    expect(response.title).toEqual("Newest Note");
    expect(searchResult[0].title).toBe("Newest Note");
  });

  it("returns error if trying to update note that does not match schema", async () => {
    const note = {
      id: "999",
      projectId: "1",
      title: "First Note",
      content: "New Note!",
    } as any as updateNoteRequest;

    expect(await noteController.update(note)).toBeInstanceOf(ZodError);
  });

  it("returns error if trying to update note by id not in db", async () => {
    const note: updateNoteRequest = {
      id: "999",
      projectId: "1",
      title: "First Note",
    };

    expect(await noteController.update(note)).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns error if trying to update note with title already in db", async () => {
    const note: updateNoteRequest = {
      id: "2",
      projectId: "1",
      title: "First Note",
    };

    expect(await noteController.update(note)).toEqual(
      new Error("Note title already in database")
    );
  });

  it("returns updated searchable note after update", async () => {
    const note: updateNoteRequest = {
      id: "2",
      projectId: "1",
      title: "Updated Second Note",
    };

    const originalCount = database.db.data!.notes.length;
    const response = (await noteController.update(note)) as Note;
    const newCount = database.db.data!.notes.length;
    const searchResult = searchController.searchNotes(response.title);

    expect(originalCount).toEqual(newCount);
    expect(response.title).toEqual("Updated Second Note");
    expect(searchResult[0].title).toEqual("Updated Second Note");
  });

  it("returns error if trying to delete with id that doesn't match schema", async () => {
    expect(await noteController.delete(123 as any as string)).toBeInstanceOf(
      ZodError
    );
  });

  it("returns error if trying to delete note by id not in database", async () => {
    expect(await noteController.delete("999")).toEqual(
      new Error("Note with id 999 not in database")
    );
  });

  it("returns true and note no longer searchable after delete", async () => {
    const response = await noteController.delete("2");
    const searchResult = searchController.searchNotes("second");

    expect(response).toEqual(true);
    expect(searchResult).toEqual([]);
  });
});
