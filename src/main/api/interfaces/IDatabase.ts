import IProject from "@/interfaces/IProject";
import ILowDb from "./ILowDb";

export default interface IDatabase {
  db: ILowDb;
  generateUniqueId: (item: IProject) => IProject;
}
