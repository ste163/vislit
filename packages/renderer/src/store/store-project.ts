import { reactive } from "vue";
import type { Project } from "interfaces";

type ProjectState = {
  all: Array<Project>;
  active: Project | null;
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

  // #checkForActiveGoal whenever the activeProject is set

  public setActiveProject(project: Project | null): void {
    this.state.active = project;
    // checkForActiveGoal
  }

  public async getProjects(): Promise<void> {
    try {
      const { api } = window;
      const response: Array<Project> = (await api.send(
        "projects-get-all"
      )) as Array<Project>;
      if (!response || response instanceof Error) {
        // display toast
        console.error(response);
        return;
      }
      this.#setProjects(response);
      // set active project based on previous state or how many projects left
      if (this.state.active) {
        // do the find on a copy of the response just in case of side effects
        const latestActiveProject: Project = this.state.all.find(
          (project) => project.id === this.state.active!.id
        ) as Project;
        this.setActiveProject(latestActiveProject);
        return;
      }
      response.length === 1
        ? this.setActiveProject(response[0])
        : this.setActiveProject(null);
    } catch (error: any | Error) {
      // This is one of the biggest errors that could occur
      // as the entire sidebar and app is locked to the welcome page
      // so this error needs to be trigger the alert from Main Process
      console.error(error);
    }
  }
}

export default ProjectStore;
