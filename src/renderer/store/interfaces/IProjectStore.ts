import ProjectState from "@/renderer/store/types/ProjectState";

export default interface IProjectStore {
  state: ProjectState;
  getProjects: () => Promise<void | undefined>;
}
