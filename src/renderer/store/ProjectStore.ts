import { reactive } from "vue";
import IProject from "@/interfaces/IProject";
import IProjectStore from "./interfaces/IProjectStore";
import ProjectState from "@/renderer/store/types/ProjectState";

export default class ProjectStore implements IProjectStore {
  readonly #API = "http://localhost:8080/project";

  public state: ProjectState;

  constructor() {
    this.state = reactive({
      all: <Array<IProject>>[],
      active: null,
    });
  }

  #setProjects(projects: Array<IProject>): void {
    this.state.all = projects;
  }

  public async getProjects(): Promise<void | undefined> {
    try {
      const response = await fetch(`${this.#API}`, {
        method: "GET",
        headers: {
          mode: "cors-anywhere",
        },
      });

      const projects: Array<IProject> = await response.json();
      this.#setProjects(projects);
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      return undefined;
    }
  }
}
