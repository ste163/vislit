import ApplicationState from "../types/ApplicationState";

export default interface IProjectStore {
  state: ApplicationState;
  setActiveView: (view: string) => void;
}
