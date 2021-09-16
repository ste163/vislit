// Renderer Store interface used by the const store: Store = inject("store")
// in child components to gain access to the store instance
import Project from "./Project";

export default interface Store {
  state: {
    activeView: string;
    projects: Array<Project>;
  };
  setters: {
    setActiveView: (view: string) => void;
    _setProjects: (projects: Array<Project>) => void;
  };
  actions: {
    getProjects: () => Promise<void | undefined>;
  };
}
