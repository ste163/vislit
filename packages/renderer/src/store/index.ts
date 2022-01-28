import ApplicationStore from "./store-application";

export class Store {
  public application: ApplicationStore;

  constructor(application: ApplicationStore) {
    this.application = application;
  }
}

const applicationStore = new ApplicationStore();
const store = new Store(applicationStore);

export default store;
