import type { IProject } from "interfaces";

export default interface IProjectController {
  getAll: () => Array<IProject> | Error;
  getById: (id: string) => IProject | Error;
  add: (project: IProject) => IProject | Error;
  update: (project: IProject) => IProject | Error;
  delete: (id: string) => true | Error;
  // eslint-disable-next-line semi
}
