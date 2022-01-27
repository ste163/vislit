import type { Column, DropZone, Type } from "interfaces";
import { reactive } from "vue";
// 1. DONE - Move project store functions into components (ie, remove abstractions)
// 2. Move remaining project state & functions into store-applications
// 3. Move store-applications into index.ts
// 4. Potentially move out of store/index.ts into global-store.ts at root
type ApplicationState = {
  // projects
  // activeProject
  // activeGoal
  types: Array<Type>;
  activeView: string;
  isSidebarMinimized: boolean;
  dropZones: Array<DropZone>;
  columns: Array<Column>;
};

class ApplicationStore {
  public state: ApplicationState;

  constructor() {
    // TODO:
    // Columns needs to be pulled/saved in localStorage
    this.state = reactive({
      isSidebarMinimized: false, // read and save to localStorage
      activeView: "/", // read and save to localStorage
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
      types: [],
    });
  }

  // Needs to be an arrow function to run the correct class instance
  setActiveView = (view: string): void => {
    this.state.activeView = view;
  };

  setIsSidebarMinimized = (): void => {
    // read from localStorage
    // if no isSidebarMinimized, set to false
    // else, set as localStorage value
    this.state.isSidebarMinimized = !this.state.isSidebarMinimized;
  };

  getAllTypes = async (): Promise<void> => {
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
