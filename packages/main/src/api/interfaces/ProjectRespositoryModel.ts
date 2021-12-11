import type { ProjectModel } from "interfaces";

interface ProjectRespositoryModel {
  getAll: () => Array<ProjectModel>;
  getById: (id: string) => ProjectModel;
  getByTitle: (title: string) => ProjectModel;
  add: (project: ProjectModel) => ProjectModel;
  update: (project: ProjectModel) => ProjectModel;
  delete: (id: string) => void;
}

export default ProjectRespositoryModel;
