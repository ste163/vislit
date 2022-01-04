import ProjectStore from "./store-project";
import ApplicationStore from "./store-application";

const applicationStore = new ApplicationStore();
const projectStore = new ProjectStore();

export class Store {
  public application: ApplicationStore;
  public projects: ProjectStore;

  constructor(application: ApplicationStore, projectStore: ProjectStore) {
    this.application = application;
    this.projects = projectStore;
  }
}

const store = new Store(applicationStore, projectStore);

export default store;
