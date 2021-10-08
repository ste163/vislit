import { reactive } from "vue";
import type { IProject } from "interfaces";
import type IProjectStore from "../interfaces/IProjectStore";
import type ProjectState from "../types/ProjectState";

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

  public setActiveProject(project: IProject): void {
  	this.state.active = project;
  }

  public async getProjects(): Promise<void | undefined> {
  	try {
  		const { api } = window;

  		const response: Array<IProject> = (await api.send(
  			"projects-get-all",
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

  public async addProject(project: IProject): Promise<IProject | undefined> {
  	try {
  		const { api } = window;

  		const response = (await api.send("projects-add", project)) as IProject;

  		if (response instanceof Error === false) {
  			// Display success message
  			this.setActiveProject(response);
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

  public async updateProject(project: IProject): Promise<IProject | undefined> {
  	try {
  		const { api } = window;

  		const response = (await api.send("projects-update", project)) as IProject;

  		if (response instanceof Error === false) {
  			// Display success message
  			this.setActiveProject(response);
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

  public async deleteProject(id: string): Promise<void | undefined> {
  	try {
  		const { api } = window;

  		const response = await api.send("projects-delete", id);
  
  		if (response instanceof Error === false) {
  			// Display success message
  			this.getProjects();
  		}	else {
  			console.log("Display error message");
  			return undefined;
  		}
  	} catch (error) {
  		const e = error as Error;
  		console.log(e.message);
  	}
  }
}
