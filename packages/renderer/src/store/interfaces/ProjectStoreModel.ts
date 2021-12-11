import type { ProjectModel } from "interfaces";
import type ProjectState from "../types/ProjectState";

interface ProjectStoreModel {
  state: ProjectState;
  setActiveProject: (project: ProjectModel | null) => void;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: ProjectModel) => Promise<ProjectModel | undefined>;
  updateProject: (project: ProjectModel) => Promise<ProjectModel | undefined>;
  deleteProject: (id: string) => Promise<true | undefined>;
}

export default ProjectStoreModel;
