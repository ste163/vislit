import { reactive } from "vue";
import type { Project } from "interfaces";

// First:
// 1. Move project store functions into components (ie, remove abstractions)
// 2. Move remaining needed state into store-applications
// 3. Move store-applications into index.ts
// 4. Potentially move out of store/index.ts into state-store.ts at root

type ProjectState = {
  all: Array<Project>;
  active: Project | null;
  // NEED ACTIVE GOAL STATE
  // whenever setting activeProject, run #checkForActiveGoal
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

      if (response && response instanceof Error === false) {
        this.#setProjects(response);
        if (this.state.active) {
          const latestActiveProject: Project = this.state.all.find(
            (project) => project.id === this.state.active!.id
          ) as Project;
          this.setActiveProject(latestActiveProject);
        } else if (response.length === 1) {
          this.setActiveProject(response[0]);
        } else {
          this.setActiveProject(null);
        }
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

      if (response && response instanceof Error === false) {
        // Display success message
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

      if (response && response instanceof Error === false) {
        // Display success message
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
}

export default ProjectStore;
