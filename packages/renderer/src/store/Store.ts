import type IStore from "./interfaces/IStore";
import type IApplicationStore from "./interfaces/IApplicationStore";
import type IProjectStore from "./interfaces/IProjectStore";

export default class Store implements IStore {
  public application: IApplicationStore;
  public projects: IProjectStore;

  constructor(application: IApplicationStore, projectStore: IProjectStore) {
  	this.application = application;
  	this.projects = projectStore;
  }
}
