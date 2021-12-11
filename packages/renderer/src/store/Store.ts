import type StoreModel from "./interfaces/StoreModel";
import type ApplicationStoreModel from "./interfaces/ApplicationStoreModel";
import type ProjectStoreModel from "./interfaces/ProjectStoreModel";

export default class Store implements StoreModel {
  public application: ApplicationStoreModel;
  public projects: ProjectStoreModel;

  constructor(
    application: ApplicationStoreModel,
    projectStore: ProjectStoreModel
  ) {
    this.application = application;
    this.projects = projectStore;
  }
}
