import lodash from "lodash";
import { nanoid } from "nanoid/non-secure";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import type { App } from "electron";
import type { Goal, Project, Type } from "interfaces";
import type { ObjectChain } from "lodash";

interface VislitDatabase {
  dbType: string;
  dbVersion: string;
  projects: Array<Project>;
  types: Array<Type>;
  goals: Array<Goal>;
  progress: Array<unknown>;
  notes: Array<unknown>;
}

interface LowDbModel extends LowSync<VislitDatabase> {
  chain: ObjectChain<VislitDatabase>; // Needed to include the chain function
}

export default class Database {
  public db: LowDbModel;
  public generateUniqueId: (item: any) => any;

  #app: App;
  #getDbPath: () => string;

  constructor(app: App) {
    this.#getDbPath = (): string => {
      const userDataDirPath = this.#app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const loadDatabase = (): LowDbModel => {
      const adapter =
        process.env.NODE_ENV === "test"
          ? new MemorySync<VislitDatabase>() // in-memory test database
          : new JSONFileSync<VislitDatabase>(this.#getDbPath());
      const db = new LowSync<VislitDatabase>(adapter) as LowDbModel;

      db.read();

      if (db.data === null) {
        // Set default database structure
        db.data = {
          dbType: "vislit",
          dbVersion: "0.1", // check version number to decide if database needs to be updated
          projects: [],
          types: [
            {
              id: "1",
              value: "novel",
            },
            {
              id: "2",
              value: "novella",
            },
            {
              id: "3",
              value: "memoir",
            },
            {
              id: "4",
              value: "short story",
            },
            {
              id: "5",
              value: "short story collection",
            },
            {
              id: "6",
              value: "poem",
            },
            {
              id: "7",
              value: "poetry collection",
            },
          ],
          goals: [],
          progress: [],
          notes: [],
        };
        db.write();
      }
      // db.data must be initialized before lodash.chain is called
      db.chain = lodash.chain(db.data);
      return db;
    };

    this.#app = app;
    this.db = loadDatabase();
    this.generateUniqueId = (item: any) => {
      item.id = nanoid(21);
      return item;
    };
  }
}
