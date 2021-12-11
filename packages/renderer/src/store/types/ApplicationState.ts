import type { ColumnModel, DropZoneModel } from "interfaces";

type ApplicationState = {
  isSidebarMinimized: boolean;
  activeView: string;
  dropZones: Array<DropZoneModel>;
  columns: Array<ColumnModel>;
};

export default ApplicationState;
