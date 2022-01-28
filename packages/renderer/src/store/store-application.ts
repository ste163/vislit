import type { Column, DropZone, Goal, Project, Type } from "interfaces";
import { reactive } from "vue";
// 1. DONE - Move project store functions into components (ie, remove abstractions)
// 2. Move remaining project state & functions into store-applications
// 3. Move store-applications into index.ts
// 4. Potentially move out of store/index.ts into global-store.ts at root
type ApplicationState = {
  projects: Project[];
  activeProject: Project | null;
  activeGoal: Goal | null;
  types: Type[];
  activeView: string;
  isSidebarMinimized: boolean;
  dropZones: DropZone[];
  columns: Column[];
};

class ApplicationStore {
  public state: ApplicationState;

  constructor() {
    // TODO:
    // Columns needs to be pulled/saved in localStorage
    this.state = reactive({
      projects: [] as Project[],
      activeProject: null,
      activeGoal: null,
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
    // see if any goals for this project
    // if there are, set active goal
  };

  // Needs to be an arrow function to run the correct class instance
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

  public getTypes = async (): Promise<void> => {
    try {
      const { api } = window;
      const response = (await api.send("types-get-all")) as Type[];
      // Check for is instance of error first
      if (response) this.state.types = response;
    } catch (error: any | Error) {
      console.error(error);
    }
  };
}

export default ApplicationStore;
