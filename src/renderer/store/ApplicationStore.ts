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
          header: "Projects",
          isActive: false,
          dropZone: "left",
          position: 0,
        },
        { header: "Notes", isActive: false, dropZone: "left", position: 1 },
        { header: "Lexicons", isActive: false, dropZone: "left", position: 2 },
        {
          header: "Settings",
          isActive: false,
          dropZone: "left",
          position: 3,
        },
      ],
    });
  }

  // Needs to be an arrow function to run the correct class instance
  setActiveView = (view: string): void => {
    this.state.activeView = view;
  };
}
