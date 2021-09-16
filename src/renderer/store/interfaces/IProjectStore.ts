import ProjectState from "@/renderer/store/types/ProjectState";
import IProject from "@/interfaces/IProject";

export default interface IProjectStore {
  state: ProjectState;
  getProjects: () => Promise<void | undefined>;
  addProject: (project: IProject) => Promise<void | undefined>;
  deleteProject: (id: string) => Promise<void | undefined>;
}
