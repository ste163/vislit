import type { IProject } from "interfaces";

export default interface IProjectRepository {
  getAll: () => Array<IProject>;
  getById: (id: string) => IProject;
  getByTitle: (title: string) => IProject;
  add: (project: IProject) => IProject;
  update: (project: IProject) => IProject;
  delete: (id: string) => void;
// eslint-disable-next-line semi
}
