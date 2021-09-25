import { reactive } from "vue";
import IProject from "@/interfaces/IProject";
import IProjectStore from "../interfaces/IProjectStore";
import ProjectState from "@/renderer/store/types/ProjectState";
import IWindow from "../interfaces/IWindow";
import convertToRequest from "../utils/convertToRequest";

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
    // try {
    //   const response = await fetch(`${this.#API}`, {
    //     method: "GET",
    //     headers: {
    //       mode: "cors-anywhere",
    //     },
    //   });
    //   const projects: Array<IProject> = await response.json();
    //   this.#setProjects(projects);
    // } catch (error) {
    //   const e = error as Error;
    //   console.error(e.message);
    //   return undefined;
    // }
  }

  public async addProject(project: IProject): Promise<void | undefined> {
    try {
      const win = window as unknown as IWindow;

      const projectRequest = convertToRequest(project, "add", "project");

      const response = await win.api.send("projects-add", projectRequest);

      console.log("RESPONSE WAS:", response);
      if (response) {
        console.log("GET ALL PROJECTS");
      } else {
        console.log("Display error message");
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }

    // try {
    //   const response = await fetch(`${this.#API}`, {
    //     method: "POST",
    //     headers: {
    //       mode: "cors-anywhere",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(project),
    //   });
    //   if (response.status === 200) {
    //     this.getProjects();
    //   }
    // } catch (error) {
    //   const e = error as Error;
    //   console.error(e.message);
    //   return undefined;
    // }
  }

  public async deleteProject(id: string): Promise<void | undefined> {
    //   try {
    //     const response = await fetch(`${this.#API}`, {
    //       method: "DELETE",
    //       headers: {
    //         mode: "cors-anywhere",
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ _id: id }),
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
