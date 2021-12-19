import type { Project } from "interfaces";
import type ProjectState from "../types/ProjectState";

interface ProjectStoreModel {
  state: ProjectState;
  setActiveProject: (project: Project | null) => void;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: Project) => Promise<Project | undefined>;
  updateProject: (project: Project) => Promise<Project | undefined>;
  deleteProject: (id: string) => Promise<true | undefined>;
}

export default ProjectStoreModel;
