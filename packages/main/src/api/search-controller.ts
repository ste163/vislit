import Minisearch from "minisearch";
import type { Project, Note } from "interfaces";
import type Database from "../database";
import { ZodError } from "zod";
import { searchRequestSchema } from "../schemas";

export default class SearchController {
  #database: Database;
  #projectSearchIndex: Minisearch<any>;
  #noteSearchIndex: Minisearch<any>;

  constructor(database: Database) {
    this.#database = database;
    this.#projectSearchIndex = this.#createProjectSearchIndex(this.#database);
    this.#noteSearchIndex = this.#createNoteSearchIndex(this.#database);
  }

  #createProjectSearchIndex(database: Database) {
    const projects = database.db.data!.projects;
    const searchIndex = new Minisearch({
      fields: ["title", "description"],
      storeFields: ["id", "title", "description"],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
      },
    });

    searchIndex.addAll(projects); // index projects synchronously
    return searchIndex;
  }

  #createNoteSearchIndex(database: Database) {
    const notes = database.db.data!.notes;
    const searchIndex = new Minisearch({
      fields: ["title"],
      storeFields: ["id", "title"],
      searchOptions: {
        fuzzy: 0.2,
      },
    });
    searchIndex.addAll(notes); // index notes synchronously
    return searchIndex;
  }

  addProject(project: Project) {
    this.#projectSearchIndex.add(project);
  }

  updateProject(originalProject: Project, updatedProject: Project) {
    // Must remove the original project before adding.
    // Trying to remove project that doesn't match index corrupts index
    this.#projectSearchIndex.remove(originalProject);
    this.#projectSearchIndex.add(updatedProject);
  }

  deleteProject(project: Project) {
    this.#projectSearchIndex.remove(project);
  }

  addNote(note: Note) {
    this.#noteSearchIndex.add(note);
  }

  updateNote(originalNote: Note, updatedNote: Note) {
    this.#noteSearchIndex.remove(originalNote);
    this.#noteSearchIndex.add(updatedNote);
  }

  deleteNote(note: Note) {
    this.#noteSearchIndex.remove(note);
  }

  searchProjects(query: string) {
    try {
      searchRequestSchema.parse(query);
      return this.#projectSearchIndex.search(query);
    } catch (error: any | Error | ZodError) {
      console.error(error);
      return error;
    }
  }

  searchNotes(query: string) {
    try {
      searchRequestSchema.parse(query);
      return this.#noteSearchIndex.search(query);
    } catch (error: any | Error | ZodError) {
      console.error(error);
      return error;
    }
  }
}
