import type { IProject } from "interfaces";
import type ProjectState from "../types/ProjectState";

export default interface IProjectStore {
  state: ProjectState;
  setActiveProject: (project: IProject | null) => void;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: IProject) => Promise<IProject | undefined>;
  updateProject: (project: IProject) => Promise<IProject | undefined>;
  deleteProject: (id: string) => Promise<true | undefined>;
// eslint-disable-next-line semi
}
