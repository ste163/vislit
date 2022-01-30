import type { Note } from "interfaces";
import type Database from "../database";

class NoteRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getAll(): Note[] {
    // used only by searchController to index all notes
    return this.#database.db.data!.notes;
  }

  getAllByProjectId(projectId: string): Note[] {
    // for now, only returning notes in alphabetical order
    return this.#database.db.data!.notes.filter(
      (note) => note.projectId === projectId
    );
  }

  getById(id: string): Note | undefined {
    return this.#database.db.data!.notes.find((note) => note?.id === id);
  }

  getByTitle(title: string): Note | undefined {
    return this.#database.db.data!.notes.find((note) => note.title === title);
  }

  add(note: Note): Note {
    this.#database.db.data!.notes.push(this.#database.generateUniqueId(note));
    this.#database.db.write();
    return this.getByTitle(note.title) as Note; // will always be a Note or the app would crash by now
  }

  update(note: Note): Note {
    const filteredNotes = this.#database.db.data!.notes.filter(
      (n) => n.id !== note.id
    );
    filteredNotes.push(note);
    this.#database.db.data!.notes = filteredNotes;
    this.#database.db.write();
    return this.getById(note.id as string) as Note;
  }

  delete(id: string): void {
    const filteredNotes = this.#database.db.data!.notes.filter(
      (n) => n.id !== id
    );
    this.#database.db.data!.notes = filteredNotes;
    this.#database.db.write();
  }
}

export default NoteRepository;
