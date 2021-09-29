import ProjectState from "@/renderer/store/types/ProjectState";
import IProject from "@/interfaces/IProject";

export default interface IProjectStore {
  state: ProjectState;
  setActiveProject: (project: IProject) => void;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: IProject) => Promise<IProject | undefined>;
  deleteProject: (id: string) => Promise<void | undefined>;
}
