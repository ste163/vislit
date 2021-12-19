import type { Project } from "interfaces";

type ProjectState = {
  all: Array<Project>;
  active: Project;
};

export default ProjectState;
