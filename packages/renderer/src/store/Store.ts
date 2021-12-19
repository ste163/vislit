import type ApplicationStore from "./modules/ApplicationStore";
import type ProjectStore from "./modules/ProjectStore";


export default class Store {
  public application: ApplicationStore;
  public projects: ProjectStore;

  constructor(
    application: ApplicationStore,
    projectStore: ProjectStore
  ) {
    this.application = application;
    this.projects = projectStore;
  }
}
