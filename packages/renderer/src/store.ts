import type { Column, DropZone, Goal, Project, Type } from "interfaces";
import { reactive } from "vue";

type state = {
  projects: Project[];
  activeProject: Project | null;
  activeGoal: Goal | undefined;
  types: Type[];
  activeView: string;
  isSidebarMinimized: boolean;
  dropZones: DropZone[];
  columns: Column[];
};

export class Store {
  public state: state;

  constructor() {
    // TODO:
    // Columns needs to be pulled/saved in localStorage
    // - Look into having this state be private
    // - then have a getter for getting computed values of projects, activeProject, etc
    this.state = reactive({
      projects: [] as Project[],
      activeProject: null,
      activeGoal: undefined, // needs to be undefined instead of null so forms can work w/ default values (null is value)
      types: [],
      activeView: "/", // read and save to localStorage
      isSidebarMinimized: false, // read and save to localStorage
      dropZones: [
        {
          name: "left",
          maxWidth: "600px",
          currentWidth: "0px",
        },
        {
          name: "right",
          maxWidth: "600px",
          currentWidth: "0px",
        },
      ],
      columns: [
        {
          header: "Projects",
          isActive: false,
          dropZone: "left",
          position: 0,
          width: "300px",
        },
        {
          header: "Notes",
          isActive: false,
          dropZone: "left",
          position: 1,
          width: "300px",
        },
        {
          header: "Settings",
          isActive: false,
          dropZone: "left",
          position: 3,
          width: "300px",
        },
      ],
    });
  }

  #setProjects = (allProjects: Project[]): void => {
    this.state.projects = allProjects;
  };

  setActiveProject = (project: Project | null): void => {
    this.state.activeProject = project;
    if (project) this.#setActiveGoal(project);
  };

  #setActiveGoal = (project: Project): void => {
    this.state.activeGoal = project.goals?.find((goal) => goal.active);
  };

  // Need to be an arrow functions to run the correct class instance
  public setActiveView = (view: string): void => {
    this.state.activeView = view;
  };

  public setIsSidebarMinimized = (): void => {
    // read from localStorage
    // if no isSidebarMinimized, set to false
    // else, set as localStorage value
    this.state.isSidebarMinimized = !this.state.isSidebarMinimized;
  };

  public getProjects = async (): Promise<void> => {
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
      if (this.state.activeProject) {
        // do the find on a copy of the response just in case of side effects
        const latestActiveProject: Project = this.state.projects.find(
          (project) => project.id === this.state.activeProject!.id
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
  };

  public updateProject = async (project: Project): Promise<void> => {
    try {
      const { api } = window;
      const response = (await api.send("projects-update", project)) as Project;
      if (response && response instanceof Error === false) {
        // Display success message
        await this.getProjects();
      } else {
        // toast error
        console.error(response);
      }
    } catch (error: any | Error) {
      console.error(error);
    }
  };

  public getTypes = async (): Promise<void> => {
    try {
      const { api } = window;
      const response = (await api.send("types-get-all")) as Type[];
      if (response && response instanceof Error === false)
        this.state.types = response;
    } catch (error: any | Error) {
      console.error(error);
    }
  };
}

export default Store;
