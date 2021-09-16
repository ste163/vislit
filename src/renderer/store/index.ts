import Store from "./Store";
import ProjectStore from "./ProjectStore";

const projectStore = new ProjectStore();
const globalStore = new Store(projectStore);

export default globalStore;
