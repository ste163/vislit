import IProject from "./IProject";
import RequestMethod from "@/types/RequestMethod";
import DataType from "@/types/DataType";

export default interface IProjectRequest extends IProject {
  requestMethod: RequestMethod;
  dataType: DataType;
}
