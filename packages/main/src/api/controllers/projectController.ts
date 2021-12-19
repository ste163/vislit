import type { Project } from "interfaces";
import type SearchController from "./searchController";
import type FileSystemController from "./fileSystemController";
import type ProjectRepository from "../repositories/projectRepository";

class ProjectController {
  #projectRepository: ProjectRepository;
  #searchController: SearchController;
  #fileSystemController: FileSystemController;

  constructor(
    projectRepository: ProjectRepository,
    searchController: SearchController,
    fileSystemController: FileSystemController
  ) {
    this.#projectRepository = projectRepository;
    this.#searchController = searchController;
    this.#fileSystemController = fileSystemController;
  }

  #checkForTitleTaken(title: string): void {
    const project = this.#projectRepository.getByTitle(title);
    if (project) throw new Error("Project title already in database");
  }

  getAll(): Project[] | Error {
    try {
      return this.#projectRepository.getAll();
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getById(id: string): Project | Error {
    try {
      const project = this.#projectRepository.getById(id);

      if (project === undefined)
        throw new Error(`Project with id ${id} not in database`);

      return project;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  add(project: Project): Project | Error {
    try {
      this.#checkForTitleTaken(project.title);

      const date = new Date();
      project.dateCreated = date;
      project.dateModified = date; // setting here so getProjects can always return the most recent project first

      const response = this.#projectRepository.add(project);
      this.#searchController.addProject(response);
      this.#fileSystemController.makeProjectDirectory(response.id);
      return response;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  update(project: Project): Project | Error {
    try {
      const projectToUpdate = this.getById(project.id);
      // Must get a copy of original project
      // before its updated, so it can be removed from search index
      const originalProjectForIndex = { ...projectToUpdate };

      if (projectToUpdate instanceof Error) return projectToUpdate; // returns thrown error

      if (project.title !== projectToUpdate.title)
        this.#checkForTitleTaken(project.title);

      // Update only certain properties
      projectToUpdate.title = project.title;
      projectToUpdate.description = project.description;
      projectToUpdate.archived = project.archived;
      projectToUpdate.completed = project.completed;
      projectToUpdate.typeId = project.typeId;
      projectToUpdate.dateModified = new Date();

      const updatedProject = this.#projectRepository.update(projectToUpdate);
      this.#searchController.updateProject(
        originalProjectForIndex as Project,
        updatedProject
      );
      return updatedProject;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  delete(id: string): true | Error {
    try {
      const project = this.getById(id);

      if (project instanceof Error) throw new Error("Project not in database");

      this.#projectRepository.delete(id);
      this.#searchController.deleteProject(project);
      this.#fileSystemController.deleteProjectDirectory(id);

      return true;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default ProjectController;
