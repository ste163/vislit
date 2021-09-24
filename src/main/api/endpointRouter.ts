import IProjectRequest from "@/interfaces/IProjectRequest";
import RequestMethod from "@/types/RequestMethod";
import DataType from "@/types/DataType";

// Potentially not need requestMethod or dataType, because the data arg will always have those
export default function routeEndpoint(
  requestMethod: RequestMethod,
  dataType: DataType,
  data: IProjectRequest // Will be any of the interfaces
): void {
  // Will eventually be returning, null, Error, IProject, etc.

  // TWO FUNCTIONS -> this can be written in a functional way!
  // first function will return which controller to hit -> based on dataType
  // second function will use that controller and

  switch (requestMethod) {
    case "get": {
      console.log("GET PROJECT");
    }
  }
}
