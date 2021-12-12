import lodash from "lodash";
import { nanoid } from "nanoid/non-secure";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import type { App } from "electron";
import type { ProjectModel } from "interfaces";
import type DatabaseModel from "./interfaces/DatabaseModel";
import type VislitDatabaseModel from "./interfaces/VislitDatabaseModel";
import type LowDbModel from "./interfaces/LowDbModel";

export default class Database implements DatabaseModel {
  public db: LowDbModel;
  public generateUniqueId: (item: ProjectModel) => ProjectModel;

  #app: App;
  #isTestEnv: string | undefined;
  #getDbPath: () => string;

  constructor(app: App) {
    this.#getDbPath = (): string => {
      const userDataDirPath = this.#app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const loadDatabase = (): LowDbModel => {
      const adapter =
        this.#isTestEnv === "test"
          ? new MemorySync<VislitDatabaseModel>() // in-memory test database
          : new JSONFileSync<VislitDatabaseModel>(this.#getDbPath());

      const db = new LowSync<VislitDatabaseModel>(adapter) as LowDbModel;

      db.read();

      if (db.data === null) {
        // Set default database structure
        db.data = {
          dbType: "vislit",
          projects: [],
          types: [],
          progress: [],
          notes: [],
          projectLexicons: [],
          lexicons: [],
          words: [],
        };

        db.write();
      }

      // db.data must be initialized before lodash.chain is called
      db.chain = lodash.chain(db.data);

      return db;
    };

    this.#app = app;
    this.#isTestEnv = process.env.NODE_ENV;
    this.db = loadDatabase();
    this.generateUniqueId = (item: ProjectModel) => {
      item.id = nanoid(21);
      return item;
    };
  }
}
