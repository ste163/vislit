import { reactive } from "vue";
import IStore from "@/renderer/store/interfaces/IStore";
import IProjectStore from "./interfaces/IProjectStore";

export default class Store implements IStore {
  public projects: IProjectStore;

  // Move the activeView & its setter into its own special class for misc./another good name
  public state: {
    activeView: string;
  };

  constructor(projectStore: IProjectStore) {
    this.projects = projectStore;

    this.state = reactive({
      activeView: "/",
    });
  }

  public setters = {
    setActiveView: (view: string): void => {
      this.state.activeView = view;
    },
  };
}
