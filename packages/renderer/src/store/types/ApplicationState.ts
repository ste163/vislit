import type { Column, DropZone } from "interfaces";

type ApplicationState = {
  isSidebarMinimized: boolean;
  activeView: string;
  dropZones: Array<DropZone>;
  columns: Array<Column>;
};

export default ApplicationState;
