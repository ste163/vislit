import Minisearch from "minisearch";
import type { ProjectModel } from "interfaces";
import type ProjectRepository from "../repositories/projectRepository";

export default class SearchController {
  #projectRespository: ProjectRepository;
  #projectSearchIndex: Minisearch<any>;

  constructor(projectRepository: ProjectRepository) {
    this.#projectRespository = projectRepository;
    this.#projectSearchIndex = this.createProjectSearchIndex(
      this.#projectRespository
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

  addProject(project: ProjectModel) {
    this.#projectSearchIndex.add(project);
  }

  deleteProject(project: ProjectModel) {
    this.#projectSearchIndex.remove(project);
  }

  updateProject(originalProject: ProjectModel, updatedProject: ProjectModel) {
    // Must remove the original project before adding.
    // Trying to remove project that doesn't match index corrupts index
    this.#projectSearchIndex.remove(originalProject);
    this.#projectSearchIndex.add(updatedProject);
  }

  searchProjects(query: string) {
    return this.#projectSearchIndex.search(query);
  }
}
