import type { LowSync } from "lowdb";
import type { ObjectChain } from "lodash";
import type VislitDatabaseModel from "./VislitDatabaseModel";

interface LowDbModel extends LowSync<VislitDatabaseModel> {
  chain: ObjectChain<VislitDatabaseModel>; // Needed to include the chain function
}

export default LowDbModel;
