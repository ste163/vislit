import IDropZone from "@/interfaces/IDropZone";
import IColumn from "@/interfaces/IColumn";

type ApplicationState = {
  activeView: string;
  dropZones: Array<IDropZone>;
  columns: Array<IColumn>;
};

export default ApplicationState;
