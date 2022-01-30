/**
 * @jest-environment node
 */
import type { Note } from "interfaces";
import Database from "../database";
import NoteRepository from "./note-repository";

describe("note-repository", () => {
  let database: Database;
  let noteRepository: NoteRepository;
  const dateForIt = new Date();
  const dateForShining = new Date();
  const noteDate1 = new Date();
  const noteDate2 = new Date();

  beforeEach(() => {
    const { app } = jest.requireMock("electron");
    database = new Database(app);
    noteRepository = new NoteRepository(database);
    database.db.data!.types = [
      {
        id: "1",
        value: "novel",
      },
      {
        id: "2",
        value: "short story",
      },
    ];
    database.db.data!.projects = [
      {
        id: "1",
        title: "It",
        description: "An evil clown attacks a town.",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: dateForIt,
        dateModified: dateForIt,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper.",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: dateForShining,
        dateModified: dateForShining,
      },
    ];
    database.db.data!.notes = [
      {
        id: "1",
        projectId: "1",
        title: "First Note",
        dateCreated: noteDate1,
        dateModified: noteDate1,
      },
      {
        id: "2",
        projectId: "1",
        title: "Second Note",
        dateCreated: noteDate2,
        dateModified: noteDate2,
      },
    ];
  });

  it("returns empty array if no notes by projectId found", () => {
    expect(noteRepository.getAll("999")).toStrictEqual([]);
  });

  it("returns notes by projectId", () => {
    expect(noteRepository.getAll("1")).toEqual([
      {
        id: "1",
        projectId: "1",
        title: "First Note",
        dateCreated: noteDate1,
        dateModified: noteDate1,
      },
      {
        id: "2",
        projectId: "1",
        title: "Second Note",
        dateCreated: noteDate2,
        dateModified: noteDate2,
      },
    ]);
  });

  it("returns undefined if no note by id found", () => {
    expect(noteRepository.getById("999")).toBeUndefined();
  });

  it("returns note by id", () => {
    expect(noteRepository.getById("1")).toEqual({
      id: "1",
      projectId: "1",
      title: "First Note",
      dateCreated: noteDate1,
      dateModified: noteDate1,
    });
  });

  it("returns undefined if no note by title found", () => {
    expect(noteRepository.getByTitle("Something Note")).toBeUndefined();
  });

  it("returns note by title", () => {
    expect(noteRepository.getByTitle("First Note")).toEqual({
      id: "1",
      projectId: "1",
      title: "First Note",
      dateCreated: noteDate1,
      dateModified: noteDate1,
    });
  });

  it("returns added note", () => {
    const note: Note = {
      title: "Characters",
      projectId: "1",
    };

    const originalCount = database.db.data!.notes.length;
    const addedNote = noteRepository.add(note);
    const newCount = database.db.data!.notes.length;

    expect(addedNote).toHaveProperty("id");
    expect(addedNote.title).toBe("Characters");
    expect(originalCount + 1).toBe(newCount);
  });
});
