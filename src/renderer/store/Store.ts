import IStore from "@/renderer/store/interfaces/IStore";
import IApplicationStore from "./interfaces/IApplicationStore";
import IProjectStore from "./interfaces/IProjectStore";

export default class Store implements IStore {
  public application: IApplicationStore;
  public projects: IProjectStore;

  constructor(application: IApplicationStore, projectStore: IProjectStore) {
    this.application = application;
    this.projects = projectStore;
  }
}
