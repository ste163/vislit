import type { IProject } from "interfaces";
import type ILowDb from "./ILowDb";

export default interface IDatabase {
  db: ILowDb;
  generateUniqueId: (item: IProject) => IProject;
  // eslint-disable-next-line semi
}
