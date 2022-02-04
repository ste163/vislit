import type NoteRepository from "./note-repository";
import type SearchController from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type { Note } from "interfaces";

class NoteController {
  #noteRepository: NoteRepository;
  #searchController: SearchController;
  // DO NOT do the file system yet; need frontend setup to manually test that it works
  #fileSystemController: FileSystemController;

  constructor(
    noteRepository: NoteRepository,
    searchController: SearchController,
    fileSystemController: FileSystemController
  ) {
    this.#noteRepository = noteRepository;
    this.#searchController = searchController;
    this.#fileSystemController = fileSystemController;
  }

  #checkForTitleTaken(title: string, projectId: string): void {
    const note = this.#noteRepository.getByTitle(title, projectId);
    if (note) throw new Error("Note title already in database");
  }

  // TODO: Make getAll return alphabetically by default; any other sorting can be on frontend
  getAllByProjectId(projectId: string): Note[] | Error {
    try {
      return this.#noteRepository.getAllByProjectId(projectId);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getById(id: string): Note | Error {
    try {
      const note = this.#noteRepository.getById(id);
      if (note === undefined)
        throw new Error(`Note with id ${id} not in database`);
      return note;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  add(note: Note): Note | Error {
    try {
      note.title = note.title.trim();
      this.#checkForTitleTaken(note.title, note.projectId);

      const date = new Date();
      note.dateCreated = date;
      note.dateModified = date;

      const response = this.#noteRepository.add(note);
      this.#searchController.addNote(response);
      // fileSystem, add note file
      return response;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  update(note: Note): Note | Error {
    try {
      const noteToUpdate = this.getById(note.id!);
      if (noteToUpdate instanceof Error) return noteToUpdate;

      const originalNoteForIndex = { ...noteToUpdate };

      if (note.title.trim() !== noteToUpdate.title)
        this.#checkForTitleTaken(note.title, note.projectId);

      // update only certain properties
      noteToUpdate.title = note.title.trim();
      noteToUpdate.dateModified = new Date();

      const updatedNote = this.#noteRepository.update(noteToUpdate);
      this.#searchController.updateNote(originalNoteForIndex, updatedNote);
      return updatedNote;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  delete(id: string): true | Error {
    try {
      const note = this.getById(id);
      if (note instanceof Error)
        throw new Error(`Note with id ${id} not in database`);

      this.#noteRepository.delete(id);
      this.#searchController.deleteNote(note);

      return true; // don't return true, just check if the repsonse is not an instance of an error
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default NoteController;
