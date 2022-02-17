import type NoteRepository from "./note-repository";
import type { SearchController } from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type { Note } from "interfaces";
import type { addNoteRequest, idRequest, updateNoteRequest } from "../schemas";
import {
  idRequestSchema,
  addNoteRequestSchema,
  updateNoteRequestSchema,
} from "../schemas";

class NoteController {
  #noteRepository: NoteRepository;
  #searchController: SearchController;
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
  getAllByProjectId(projectId: idRequest): Note[] | Error {
    try {
      idRequestSchema.parse(projectId);
      return this.#noteRepository.getAllByProjectId(projectId);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  async getById(id: idRequest): Promise<Note | Error> {
    try {
      idRequestSchema.parse(id);
      const note = this.#noteRepository.getById(id);
      if (note === undefined)
        throw new Error(`Note with id ${id} not in database`);

      const html = await this.#fileSystemController.readNoteById({
        noteId: note.id!,
        projectId: note.projectId,
      });
      note.html = html instanceof Error || !html ? null : html;
      return note;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  async add(request: addNoteRequest): Promise<Note | Error> {
    try {
      addNoteRequestSchema.parse(request);

      const note = { ...request } as Note;

      note.title = note.title.trim();
      this.#checkForTitleTaken(note.title, note.projectId);

      const date = new Date();
      note.dateCreated = date;
      note.dateModified = date;

      const response = await this.#noteRepository.add(note);
      this.#searchController.addNote(response);

      return response;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  async update(request: updateNoteRequest): Promise<Note | Error> {
    try {
      updateNoteRequestSchema.parse(request);
      const note = { ...request };

      const noteToUpdate = await this.getById(note.id);
      if (noteToUpdate instanceof Error) return noteToUpdate;

      const originalNoteForIndex = { ...noteToUpdate };

      if (note.title.trim() !== noteToUpdate.title)
        this.#checkForTitleTaken(note.title, note.projectId);

      // update only certain properties
      noteToUpdate.title = note.title.trim();
      noteToUpdate.dateModified = new Date();

      const updatedNote = await this.#noteRepository.update(noteToUpdate);
      this.#searchController.updateNote(originalNoteForIndex, updatedNote);
      return updatedNote;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  async delete(id: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(id);
      const note = await this.getById(id);
      if (note instanceof Error)
        throw new Error(`Note with id ${id} not in database`);

      await this.#noteRepository.delete(id);
      this.#searchController.deleteNote(note);
      await this.#fileSystemController.deleteNote({
        id,
        projectId: note.projectId,
      });

      return true; // returning true instead of undefined because that could potentially mean other things
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default NoteController;
