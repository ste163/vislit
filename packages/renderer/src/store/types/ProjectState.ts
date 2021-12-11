import type { ProjectModel } from "interfaces";

type ProjectState = {
  all: Array<ProjectModel>;
  active: ProjectModel | null;
};

export default ProjectState;
