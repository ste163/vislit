import type { Note } from "interfaces";
import type Database from "../database";

class NoteRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  // getByTitle - possibly, to check for duplicate titles
  // add(note)
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
}

export default NoteRepository;
