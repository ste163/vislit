import Minisearch from "minisearch";
import type { Project } from "interfaces";
import type ProjectRepository from "./project-repository";

export default class SearchController {
  #projectRepository: ProjectRepository;
  #projectSearchIndex: Minisearch<any>;

  constructor(projectRepository: ProjectRepository) {
    this.#projectRepository = projectRepository;
    this.#projectSearchIndex = this.createProjectSearchIndex(
      this.#projectRepository
    );
  }

  createProjectSearchIndex(projectRepository: ProjectRepository) {
    const projects = projectRepository.getAll();
    const searchIndex = new Minisearch({
      fields: ["title", "description"],
      storeFields: ["id", "title", "description"],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
      },
    });

    searchIndex.addAll(projects); // Index projects synchronously
    return searchIndex;
  }

  addProject(project: Project) {
    this.#projectSearchIndex.add(project);
  }

  deleteProject(project: Project) {
    this.#projectSearchIndex.remove(project);
  }

  updateProject(originalProject: Project, updatedProject: Project) {
    // Must remove the original project before adding.
    // Trying to remove project that doesn't match index corrupts index
    this.#projectSearchIndex.remove(originalProject);
    this.#projectSearchIndex.add(updatedProject);
  }

  searchProjects(query: string) {
    return this.#projectSearchIndex.search(query);
  }
}
