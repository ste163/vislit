import type { Project } from "interfaces";
import type SearchController from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type ProjectRepository from "./project-repository";
import type {
  idRequest,
  projectAddRequest,
  projectUpdateRequest,
} from "../schemas";
import {
  idRequestSchema,
  projectAddRequestSchema,
  projectUpdateRequestSchema,
} from "../schemas";

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

  add(project: projectAddRequest): Project | Error {
    try {
      projectAddRequestSchema.parse(project);

      project.title = project.title.trim();
      project.description = project.description.trim();

      this.#checkForTitleTaken(project.title);

      // Type conversion from request schema to Project
      const projectToAdd = { ...project } as Project;

      const date = new Date();
      projectToAdd.dateCreated = date;
      projectToAdd.dateModified = date; // setting here so getProjects can always return the most recent project first
      projectToAdd.completed = false;
      projectToAdd.archived = false;

      const response = this.#projectRepository.add(projectToAdd);
      this.#searchController.addProject(response);
      this.#fileSystemController.makeProjectDirectory(response.id!);
      return response;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  update(project: projectUpdateRequest): Project | Error {
    try {
      projectUpdateRequestSchema.parse(project);

      const projectToUpdate = this.getById(project.id);
      if (projectToUpdate instanceof Error) return projectToUpdate;

      // Must get a copy of original project
      // before its updated, so it can be removed from search index
      const originalProjectForIndex = { ...projectToUpdate };

      if (project.title.trim() !== projectToUpdate.title)
        this.#checkForTitleTaken(project.title);

      // Update only certain properties
      projectToUpdate.title = project.title.trim();
      projectToUpdate.description = project.description.trim();
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

  delete(id: idRequest): true | Error {
    try {
      idRequestSchema.parse(id);

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
