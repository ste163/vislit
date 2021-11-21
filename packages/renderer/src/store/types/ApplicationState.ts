import type { IColumn, IDropZone } from "interfaces";

type ApplicationState = {
  isSidebarMinimized: boolean;
  activeView: string;
  dropZones: Array<IDropZone>;
  columns: Array<IColumn>;
};

export default ApplicationState;
