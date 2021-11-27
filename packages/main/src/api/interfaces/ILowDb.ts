import type { LowSync } from "lowdb";
import type { ObjectChain } from "lodash";
import type IVislitDatabase from "./IVislitDatabase";

// Needed to include the chain function w/o errors
export default interface ILowDb extends LowSync<IVislitDatabase> {
  chain: ObjectChain<IVislitDatabase>;
  // eslint-disable-next-line semi
}
