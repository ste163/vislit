import Minisearch from "minisearch";
import { ZodError } from "zod";
import type { Project, Note } from "interfaces";
import type { Database } from "../database";
import type { searchRequest } from "../schemas";
import { searchRequestSchema } from "../schemas";

// Must initialize search indexes outside of class constructor
// as constructors can't be async
export async function initializeSearchIndexes(database: Database): Promise<{
  projectSearchIndex: Minisearch<any>;
  noteSearchIndex: Minisearch<any>;
}> {
  console.log("initializing search indexes");

  const projects = database.db.data!.projects;
  const projectSearchIndex = new Minisearch({
    fields: ["title", "description"],
    storeFields: ["id", "title", "description"],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
    },
  });

  await projectSearchIndex.addAllAsync(projects);

  const notes = database.db.data!.notes;
  const noteSearchIndex = new Minisearch({
    fields: ["title"],
    storeFields: ["id", "title"],
    searchOptions: {
      fuzzy: 0.2,
    },
  });

  await noteSearchIndex.addAllAsync(notes);

  return { projectSearchIndex, noteSearchIndex };
}

export class SearchController {
  #projectSearchIndex: Minisearch<any>;
  #noteSearchIndex: Minisearch<any>;

  constructor(
    projectSearchIndex: Minisearch<any>,
    noteSearchIndex: Minisearch<any>
  ) {
    this.#projectSearchIndex = projectSearchIndex;
    this.#noteSearchIndex = noteSearchIndex;
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

  searchProjects(query: searchRequest) {
    try {
      searchRequestSchema.parse(query);
      return this.#projectSearchIndex.search(query);
    } catch (error: any | Error | ZodError) {
      console.error(error);
      return error;
    }
  }

  searchNotes(query: searchRequest) {
    try {
      searchRequestSchema.parse(query);
      return this.#noteSearchIndex.search(query);
    } catch (error: any | Error | ZodError) {
      console.error(error);
      return error;
    }
  }
}
