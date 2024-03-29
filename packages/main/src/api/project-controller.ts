import type { Project } from "interfaces";
import type { SearchController } from "./search-controller";
import type FileSystemController from "./file-system-controller";
import type ProjectRepository from "./project-repository";
import type {
  idRequest,
  projectAddRequest,
  projectUpdateRequest,
} from "./request-schemas";
import {
  idRequestSchema,
  projectAddRequestSchema,
  projectUpdateRequestSchema,
} from "./request-schemas";
import handleError from "./util-handle-error";

class ProjectController {
  constructor(
    private projectRepository: ProjectRepository,
    private searchController: SearchController,
    private fileSystemController: FileSystemController
  ) {}

  #checkForTitleTaken(title: string): void {
    const project = this.projectRepository.getByTitle(title);
    if (project) throw new Error("Project title already in database");
  }

  getAll(): Project[] | Error {
    try {
      return this.projectRepository.getAll();
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  getById(id: idRequest): Project | Error {
    try {
      idRequestSchema.parse(id);
      const project = this.projectRepository.getById(id);
      if (project === undefined)
        throw new Error(`Project with id ${id} not in database`);
      return project;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async add(request: projectAddRequest): Promise<Project | Error> {
    try {
      projectAddRequestSchema.parse(request);

      request.title = request.title.trim();
      request.description = request.description && request.description.trim();

      this.#checkForTitleTaken(request.title);

      const projectToAdd = { ...request } as Project;

      const date = new Date();
      projectToAdd.dateCreated = date;
      projectToAdd.dateModified = date; // setting here so getProjects can always return the most recent project first
      projectToAdd.completed = false;
      projectToAdd.archived = false;

      const response = await this.projectRepository.add(projectToAdd);
      this.searchController.addProject(response);
      const fsResponse = await this.fileSystemController.makeProjectDirectory(
        response.id!
      );
      if (fsResponse instanceof Error) throw fsResponse;
      return response;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async update(request: projectUpdateRequest): Promise<Project | Error> {
    try {
      projectUpdateRequestSchema.parse(request);

      const { id, title, description, archived, completed, typeId } = request;

      const projectToUpdate = this.getById(id);
      if (projectToUpdate instanceof Error) return projectToUpdate;

      // Must get a copy of original project
      // before its updated, so it can be removed from search index
      const originalProjectForIndex = { ...projectToUpdate };

      if (title.trim() !== projectToUpdate.title)
        this.#checkForTitleTaken(title);

      // Update only certain properties
      projectToUpdate.title = title.trim(); // must trim here and in the if check before, or it doesn't save
      projectToUpdate.description = description.trim();
      projectToUpdate.archived = archived;
      projectToUpdate.completed = completed;
      projectToUpdate.typeId = typeId;
      projectToUpdate.dateModified = new Date();

      const updatedProject = await this.projectRepository.update(
        projectToUpdate
      );
      this.searchController.updateProject(
        originalProjectForIndex as Project,
        updatedProject
      );
      return updatedProject;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async delete(id: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(id);

      const project = this.getById(id);
      if (project instanceof Error) throw new Error("Project not in database");

      await this.projectRepository.delete(id);
      this.searchController.deleteProject(project);
      const fsResponse = await this.fileSystemController.deleteProjectDirectory(
        id
      );
      if (fsResponse instanceof Error) throw fsResponse;

      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }
}

export default ProjectController;
