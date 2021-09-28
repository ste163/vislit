import { reactive } from "vue";
import IProject from "@/interfaces/IProject";
import IProjectStore from "../interfaces/IProjectStore";
import ProjectState from "@/renderer/store/types/ProjectState";
import IWindow from "../interfaces/IWindow";

export default class ProjectStore implements IProjectStore {
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
      const { api } = window as unknown as IWindow;

      const response: Array<IProject> = (await api.send(
        "projects-get-all"
      )) as Array<IProject>;

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

  public async addProject(project: IProject): Promise<void | undefined> {
    try {
      const { api } = window as unknown as IWindow;

      const response = await api.send("projects-add", project);

      if (response) {
        // Display success message
        this.getProjects();
      } else {
        console.log("Display error message");
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  }

  public async deleteProject(id: string): Promise<void | undefined> {
    //   try {
    //     const response = await fetch(`${this.#API}`, {
    //       method: "DELETE",
    //       headers: {
    //         mode: "cors-anywhere",
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ id: id }),
    //     });
    //     if (response.status === 200) {
    //       this.getProjects();
    //     }
    //   } catch (error) {
    //     const e = error as Error;
    //     console.error(e.message);
    //     return undefined;
    //   }
  }
}
