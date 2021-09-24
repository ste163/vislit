// Converts interfaces into interfaceRequests

import IProject from "@/interfaces/IProject";
import IProjectRequest from "@/interfaces/IProjectRequest";
import DataType from "@/types/DataType";
import RequestMethod from "@/types/RequestMethod";

type data = IProject;
type returnValue = IProjectRequest;

export default function convertToRequest(
  data: data,
  requestMethod: RequestMethod,
  dataType: DataType
): returnValue {
  const newRequest = data as returnValue;
  newRequest.requestMethod = requestMethod;
  newRequest.dataType = dataType;

  return newRequest;
}
