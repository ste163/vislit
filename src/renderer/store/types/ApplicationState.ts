import IColumn from "@/interfaces/IColumn";

type ApplicationState = {
  activeView: string;
  columns: Array<IColumn>;
};

export default ApplicationState;
