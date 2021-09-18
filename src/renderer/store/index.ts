import Store from "./Store";
import ProjectStore from "./ProjectStore";
import ApplicationStore from "./ApplicationStore";

const applicationStore = new ApplicationStore();
const projectStore = new ProjectStore();

const store = new Store(applicationStore, projectStore);

export default store;
