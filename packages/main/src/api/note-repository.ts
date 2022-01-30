import type { Note } from "interfaces";
import type Database from "../database";

class NoteRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  // update(note)
  // delete(note)

  getAll(projectId: string): Note[] {
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
}

export default NoteRepository;
