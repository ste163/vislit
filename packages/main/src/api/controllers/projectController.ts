import type { ProjectModel } from "interfaces";
import type ProjectControllerModel from "../interfaces/ProjectControllerModel";
import type ProjectRespositoryModel from "../interfaces/ProjectRespositoryModel";

export default class ProjectController implements ProjectControllerModel {
  #projectRepository: ProjectRespositoryModel;

  constructor(projectRepository: ProjectRespositoryModel) {
    this.#projectRepository = projectRepository;
    // this.searchController = searchController;
  }

  #checkForTitleTaken(title: string): void {
    const project = this.#projectRepository.getByTitle(title);

    // Only add/update project if it's undefined
    if (project !== undefined) {
      throw new Error("Project title already in database");
    }

    // Otherwise, continue running code because no error was thrown
  }

  getAll(): Array<ProjectModel> | Error {
    try {
      return this.#projectRepository.getAll();
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return error;
    }
  }

  getById(id: string): ProjectModel | Error {
    try {
      const project = this.#projectRepository.getById(id);

      if (project === undefined) {
        throw new Error(`Project with id ${id} not in database`);
      }

      return project;
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return error;
    }
  }

  add(project: ProjectModel): ProjectModel | Error {
    try {
      this.#checkForTitleTaken(project.title);

      const date = new Date();

      project.dateCreated = date;
      project.dateModified = date; // setting here so getProjects can always return the most recent project first

      const response = this.#projectRepository.add(project);

      // this.searchController.addProject(response);
      return response;
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return error;
    }
  }

  update(project: ProjectModel): ProjectModel | Error {
    try {
      const projectToUpdate = this.getById(project.id);
      // Must get a copy of original project
      // before its updated, so it can be removed from search index
      // const originalProjectForIndex = { ...projectToUpdate };

      if (projectToUpdate instanceof Error) {
        return projectToUpdate; // return thrown error
      }

      // ADD TEST: Only check for title if the titles do not match
      if (project.title !== projectToUpdate.title) {
        this.#checkForTitleTaken(project.title);
      }

      // When here, we're good to update!
      // Update only certain properties
      projectToUpdate.title = project.title;
      projectToUpdate.description = project.description;
      projectToUpdate.archived = project.archived;
      projectToUpdate.completed = project.completed;
      projectToUpdate.typeId = project.typeId;
      projectToUpdate.dateModified = new Date();

      const updatedProject = this.#projectRepository.update(projectToUpdate);

      // this.searchController.updateProject(
      //   originalProjectForIndex,
      //   updatedProject
      // );

      return updatedProject;
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return error;
    }
  }

  delete(id: string): true | Error {
    try {
      const project = this.getById(id);

      if (project instanceof Error) {
        throw new Error("Project not in database");
      }

      this.#projectRepository.delete(id);

      // this.searchController.removeProject(project);

      return true;
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return error;
    }
  }
}
