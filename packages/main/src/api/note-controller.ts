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

  #checkForTitleTaken(title: string): void {
    const note = this.#noteRepository.getByTitle(title);
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

  // add(note)
  // update(note)
  // delete(note)
}

export default NoteController;
