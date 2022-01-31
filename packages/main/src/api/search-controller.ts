import Minisearch from "minisearch";
import type { Project, Note } from "interfaces";
import type ProjectRepository from "./project-repository";
import type NoteRepository from "./note-repository";

// TODO: only import the Database instance
// no need for controllers as we're pulling all the data
// Once done:
// - remove the getAll from notes
// - update tests
export default class SearchController {
  #projectRepository: ProjectRepository;
  #noteRepository: NoteRepository;
  #projectSearchIndex: Minisearch<any>;
  #noteSearchIndex: Minisearch<any>;

  constructor(
    projectRepository: ProjectRepository,
    noteRepository: NoteRepository
  ) {
    this.#projectRepository = projectRepository;
    this.#noteRepository = noteRepository;
    this.#projectSearchIndex = this.#createProjectSearchIndex(
      this.#projectRepository
    );
    this.#noteSearchIndex = this.#createNoteSearchIndex(this.#noteRepository);
  }

  #createProjectSearchIndex(projectRepository: ProjectRepository) {
    const projects = projectRepository.getAll();
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

  #createNoteSearchIndex(noteRepository: NoteRepository) {
    const notes = noteRepository.getAll();
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
    return this.#projectSearchIndex.search(query);
  }

  searchNotes(query: string) {
    return this.#noteSearchIndex.search(query);
  }
}
