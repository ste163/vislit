import type { IProject } from "interfaces";

type ProjectState = {
  all: Array<IProject>;
  active: IProject | null;
};

export default ProjectState;
