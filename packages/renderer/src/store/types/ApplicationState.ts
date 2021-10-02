import type { IDropZone } from "../../../../shared/interfaces";
import type { IColumn } from "../../../../shared/interfaces";

type ApplicationState = {
  activeView: string;
  dropZones: Array<IDropZone>;
  columns: Array<IColumn>;
};

export default ApplicationState;
