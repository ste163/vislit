import type ProjectRespositoryModel from "./ProjectRespositoryModel";
import type { ProjectModel } from "interfaces";
import type Minisearch from "minisearch";
import type { SearchResult } from "minisearch";

interface SearchControllerModel {
  createProjectSearchIndex: (
    projectRepository: ProjectRespositoryModel
  ) => Minisearch<any>;
  addProject: (project: ProjectModel) => void;
  deleteProject: (project: ProjectModel) => void;
  updateProject: (
    originalProject: ProjectModel,
    updatedProject: ProjectModel
  ) => void;
  searchProjects: (query: string) => SearchResult[];
}

export default SearchControllerModel;
