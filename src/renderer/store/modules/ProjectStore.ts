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

      let response = false;

      await win.ipcRenderer.send("toMain", projectRequest);

      // It's not waiting!!! -> If I can't get it figured out, will have to
      // remove the contextBridge and just expose the entire ipcRenderer to the browser
      await win.ipcRenderer.receive("fromMain", async (res) => {
        console.log("RECEIVED FROM BACKEND", res);
        response = res as boolean;
        return res;
      });
      console.log("Reassigned", response);
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
