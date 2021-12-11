import { reactive } from "vue";
import type { ProjectModel } from "interfaces";
import type ProjectStoreModel from "../interfaces/ProjectStoreModel";
import type ProjectState from "../types/ProjectState";

export default class ProjectStore implements ProjectStoreModel {
  public state: ProjectState;

  constructor() {
    this.state = reactive({
      all: <Array<ProjectModel>>[],
      active: null,
    });
  }

  #setProjects(projects: Array<ProjectModel>): void {
    this.state.all = projects;
  }

  public setActiveProject(project: ProjectModel | null): void {
    this.state.active = project;
  }

  public async getProjects(): Promise<void | undefined> {
    try {
      const { api } = window;

      const response: Array<ProjectModel> = (await api.send(
        "projects-get-all"
      )) as Array<ProjectModel>;

      if (response) {
        this.#setProjects(response);
      } else {
        // Display error message
      }
    } catch (error) {
      // This is one of the biggest errors that could occur
      // as the entire sidebar and app is locked to the welcome page
      // so this error needs to be trigger the alert from Main Process
      const e = error as Error;
      console.log(e.message);
    }
  }

  public async addProject(
    project: ProjectModel
  ): Promise<ProjectModel | undefined> {
    try {
      const { api } = window;

      const response = (await api.send(
        "projects-add",
        project
      )) as ProjectModel;

      if (response instanceof Error === false) {
        // Display success message
        this.setActiveProject(response);
        await this.getProjects();
        return response;
      } else {
        console.log("Display error message");
        return undefined;
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  }

  public async updateProject(
    project: ProjectModel
  ): Promise<ProjectModel | undefined> {
    try {
      const { api } = window;

      const response = (await api.send(
        "projects-update",
        project
      )) as ProjectModel;

      if (response instanceof Error === false) {
        // Display success message
        this.setActiveProject(response);
        await this.getProjects();
        return response;
      } else {
        console.log("Display error message");
        return undefined;
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  }

  public async deleteProject(id: string): Promise<true | undefined> {
    try {
      const { api } = window;

      const response = await api.send("projects-delete", id);

      if (response instanceof Error === false) {
        // Display success message
        await this.getProjects();
        return true;
      } else {
        console.log("Display error message");
        return undefined;
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  }
}
