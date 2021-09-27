import { LowSync } from "lowdb";
import { ObjectChain } from "lodash";
import IVislitDatabase from "./IVislitDatabase";

// Needed to include the chain function w/o errors
export default interface ILowDb extends LowSync<IVislitDatabase> {
  chain: ObjectChain<IVislitDatabase>;
}
