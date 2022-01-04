import { reactive } from "vue";
import type { Project } from "interfaces";

type ProjectState = {
  all: Array<Project>;
  active: Project | null;
};

class ProjectStore {
  public state: ProjectState;

  constructor() {
    this.state = reactive({
      all: <Array<Project>>[],
      active: null,
    });
  }

  #setProjects(projects: Array<Project>): void {
    this.state.all = projects;
  }

  public setActiveProject(project: Project | null): void {
    this.state.active = project;
  }

  public async getProjects(): Promise<void | undefined> {
    try {
      const { api } = window;

      const response: Array<Project> = (await api.send(
        "projects-get-all"
      )) as Array<Project>;

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

  public async addProject(project: Project): Promise<Project | undefined> {
    try {
      const { api } = window;

      const response = (await api.send("projects-add", project)) as Project;

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

  public async updateProject(project: Project): Promise<Project | undefined> {
    try {
      const { api } = window;

      const response = (await api.send("projects-update", project)) as Project;

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

export default ProjectStore;
