import { reactive } from "vue";
// import IColumn from "@/interfaces/IColumn"
import IApplicationStore from "./interfaces/IApplicationStore";
import ApplicationState from "./types/ApplicationState";

export default class ApplicationStore implements IApplicationStore {
  public state: ApplicationState;

  constructor() {
    // TODO:
    // Read last activeView state from localStorage; If none, set to "/"
    // Columns needs to be pulled/saved in localStorage
    this.state = reactive({
      activeView: "/",
      columns: [
        {
          header: "Settings",
          isActive: false,
          dropZone: "left",
          position: 0,
        },
        {
          header: "Projects",
          isActive: false,
          dropZone: "left",
          position: 1,
        },
        { header: "Notes", isActive: false, dropZone: "left", position: 2 },
        { header: "Lexicons", isActive: false, dropZone: "right", position: 0 },
      ],
    });
  }

  // Needs to be an arrow function to run the correct class instance
  setActiveView = (view: string): void => {
    this.state.activeView = view;
  };
}
