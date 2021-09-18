import { reactive } from "vue";
// import IColumn from "@/interfaces/IColumn"
import IApplicationStore from "./interfaces/IApplicationStore";
import ApplicationState from "./types/ApplicationState";

export default class ApplicationStore implements IApplicationStore {
  public state: ApplicationState;

  constructor() {
    // TODO:
    // Read last activeView state from localStorage; If none, set to "/"
    this.state = reactive({
      activeView: "/",
      columns: [],
    });
  }

  // Needs to be an arrow function to run the correct class instance
  setActiveView = (view: string): void => {
    this.state.activeView = view;
  };
}
