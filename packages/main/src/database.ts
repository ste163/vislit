import { nanoid } from "nanoid/non-secure";
import type { Low } from "lowdb";
import type { VislitDatabase } from "./init-database";

export default class Database {
  public db: Low<VislitDatabase>;
  public generateUniqueId: (item: any) => any;

  constructor(db: Low<VislitDatabase>) {
    this.db = db;
    this.generateUniqueId = (item: any) => {
      item.id = nanoid(13);
      return item;
    };
  }
}
