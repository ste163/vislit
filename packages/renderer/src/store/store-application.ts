import type { Column, DropZone, Type } from "interfaces";
import { reactive } from "vue";

type ApplicationState = {
  isSidebarMinimized: boolean;
  activeView: string;
  dropZones: Array<DropZone>;
  columns: Array<Column>;
  types: Array<Type>;
};

class ApplicationStore {
  public state: ApplicationState;

  constructor() {
    // TODO:
    // Read last activeView state from localStorage; If none, set to "/"
    // Columns needs to be pulled/saved in localStorage
    this.state = reactive({
      isSidebarMinimized: false, // read and save to localStorage
      activeView: "/",
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
      if (response) this.state.types = response;
    } catch (error: any | Error) {
      console.error(error);
    }
  };
}

export default ApplicationStore;