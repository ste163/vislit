import IProject from "@/interfaces/IProject";

type ProjectState = {
  all: Array<IProject>;
  active: IProject | null;
};

export default ProjectState;
