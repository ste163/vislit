import type ProjectState from "../types/ProjectState";
import type { IProject } from "../../../../shared/interfaces";

export default interface IProjectStore {
  state: ProjectState;
  setActiveProject: (project: IProject) => void;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: IProject) => Promise<IProject | undefined>;
  deleteProject: (id: string) => Promise<void | undefined>;
// eslint-disable-next-line semi
}
