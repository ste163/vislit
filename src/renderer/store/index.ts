import Store from "./Store";
import ProjectStore from "./modules/ProjectStore";
import ApplicationStore from "./modules/ApplicationStore";

const applicationStore = new ApplicationStore();
const projectStore = new ProjectStore();

const store = new Store(applicationStore, projectStore);

export default store;
