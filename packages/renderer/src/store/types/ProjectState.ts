import type { Project } from "interfaces";

type ProjectState = {
  all: Array<Project>;
  active: Project | null;
};

export default ProjectState;
