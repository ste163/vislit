import type { ProjectModel } from "interfaces";
import type ProjectControllerModel from "../interfaces/ProjectControllerModel";
import type ProjectRespositoryModel from "../interfaces/ProjectRespositoryModel";
import type SearchControllerModel from "../interfaces/SearchControllerModel";
import type FileSystemController from "./fileSystemController";

export default class ProjectController implements ProjectControllerModel {
  #projectRepository: ProjectRespositoryModel;
  #searchController: SearchControllerModel;
  #fileSystemController: FileSystemController;

  constructor(
    projectRepository: ProjectRespositoryModel,
    searchController: SearchControllerModel,
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

  getAll(): Array<ProjectModel> | Error {
    try {
      return this.#projectRepository.getAll();
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  getById(id: string): ProjectModel | Error {
    try {
      const project = this.#projectRepository.getById(id);

      if (project === undefined) {
        throw new Error(`Project with id ${id} not in database`);
      }

      return project;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  add(project: ProjectModel): ProjectModel | Error {
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

  update(project: ProjectModel): ProjectModel | Error {
    try {
      const projectToUpdate = this.getById(project.id);
      // Must get a copy of original project
      // before its updated, so it can be removed from search index
      const originalProjectForIndex = { ...projectToUpdate };

      if (projectToUpdate instanceof Error) {
        return projectToUpdate; // returns thrown error
      }

      if (project.title !== projectToUpdate.title) {
        this.#checkForTitleTaken(project.title);
      }

      // Update only certain properties
      projectToUpdate.title = project.title;
      projectToUpdate.description = project.description;
      projectToUpdate.archived = project.archived;
      projectToUpdate.completed = project.completed;
      projectToUpdate.typeId = project.typeId;
      projectToUpdate.dateModified = new Date();

      const updatedProject = this.#projectRepository.update(projectToUpdate);

      this.#searchController.updateProject(
        originalProjectForIndex as ProjectModel,
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

      if (project instanceof Error) {
        throw new Error("Project not in database");
      }

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
