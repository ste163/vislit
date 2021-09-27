import { App } from "electron";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import lodash from "lodash";
import { nanoid } from "nanoid/non-secure";
import IDatabase from "./interfaces/IDatabase";
import IProject from "@/interfaces/IProject";
import IVislitDatabase from "./interfaces/IVislitDatabase";
import ILowDb from "./interfaces/ILowDb";

export default class Database implements IDatabase {
  public db: ILowDb;
  public generateUniqueId: (item: IProject) => IProject;

  #app: App;
  #isTestEnv: string | undefined;
  #getDbPath: () => string;

  constructor(app: App) {
    this.#getDbPath = (): string => {
      const userDataDirPath = this.#app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const loadDatabase = (): ILowDb => {
      const adapter =
        this.#isTestEnv === "test"
          ? new MemorySync<IVislitDatabase>() // in-memory test database
          : new JSONFileSync<IVislitDatabase>(this.#getDbPath());

      const db = new LowSync<IVislitDatabase>(adapter) as ILowDb;

      db.read();

      if (db.data === null) {
        // Set default database structure
        db.data = {
          dbType: "vislit",
          projects: [],
          types: [],
          progress: [],
          notes: [],
          projectLexicon: [],
          lexicon: [],
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
    this.generateUniqueId = (item: IProject) => {
      item.id = nanoid(21);
      return item;
    };
  }
}
