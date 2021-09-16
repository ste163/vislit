import { reactive } from "vue";
import Store from "@/interfaces/Store";
import Project from "@/interfaces/Project";

const API = "http://localhost:8080";

// Global state, setters, & getters
const state = reactive({
  activeView: "/",
  projects: <Project[]>[],
});

const setters = {
  setActiveView: (view: string): void => {
    state.activeView = view;
  },
  _setProjects: (projects: Array<Project>): void => {
    state.projects = projects;
  },
};

const actions = {
  getProjects: async (): Promise<void | undefined> => {
    try {
      const response = await fetch(`${API}/project`, {
        method: "GET",
        headers: {
          mode: "cors-anywhere",
        },
      });
      const projects: Array<Project> = await response.json();
      setters._setProjects(projects);
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      return undefined;
    }
  },
};

const store: Store = {
  state,
  setters,
  actions,
};

export default store;
