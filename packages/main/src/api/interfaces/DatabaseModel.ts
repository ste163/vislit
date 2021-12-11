import type { ProjectModel } from "interfaces";
import type LowdDbModel from "./LowDbModel";

interface DatabaseModel {
  db: LowdDbModel;
  generateUniqueId: (item: ProjectModel) => ProjectModel;
}

export default DatabaseModel;
