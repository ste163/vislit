import type { Note } from "interfaces";
import type Database from "../database";

class NoteRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
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

  getByTitle(title: string, projectId: string): Note | undefined {
    return this.#database.db.data!.notes.find(
      (note) => note.title === title && note.projectId === projectId
    );
  }

  async add(note: Note): Promise<Note> {
    this.#database.db.data!.notes.push(this.#database.generateUniqueId(note));
    await this.#database.db.write();
    return this.getByTitle(note.title, note.projectId) as Note; // will always be a Note or the app would crash by now
  }

  async update(note: Note): Promise<Note> {
    const filteredNotes = this.#database.db.data!.notes.filter(
      (n) => n.id !== note.id
    );
    filteredNotes.push(note);
    this.#database.db.data!.notes = filteredNotes;
    await this.#database.db.write();
    return this.getById(note.id as string) as Note;
  }

  async delete(id: string): Promise<void> {
    const filteredNotes = this.#database.db.data!.notes.filter(
      (n) => n.id !== id
    );
    this.#database.db.data!.notes = filteredNotes;
    await this.#database.db.write();
  }
}

export default NoteRepository;
