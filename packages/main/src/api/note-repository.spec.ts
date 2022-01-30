/**
 * @jest-environment node
 */
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
});
