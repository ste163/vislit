import type { ProjectModel } from "interfaces";

interface ProjectControllerModel {
  getAll: () => Array<ProjectModel> | Error;
  getById: (id: string) => ProjectModel | Error;
  add: (project: ProjectModel) => ProjectModel | Error;
  update: (project: ProjectModel) => ProjectModel | Error;
  delete: (id: string) => true | Error;
}

export default ProjectControllerModel;
