import type ApplicationState from "../types/ApplicationState";

export default interface IProjectStore {
  state: ApplicationState;
  setActiveView: (view: string) => void;
  setIsSidebarMinimized: () => void;
// eslint-disable-next-line semi
}
