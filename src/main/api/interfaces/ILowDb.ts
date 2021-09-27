import { LowSync } from "lowdb";
import { ObjectChain } from "lodash";
import IDatabase from "./IDatabase";

// Needed to include the chain function w/o errors
export default interface ILowDb extends LowSync<IDatabase> {
  chain: ObjectChain<IDatabase>;
}
