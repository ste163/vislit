import type ApplicationState from "../types/ApplicationState";

interface ApplicationStoreModel {
  state: ApplicationState;
  setActiveView: (view: string) => void;
  setIsSidebarMinimized: () => void;
}

export default ApplicationStoreModel;
