import { App } from "electron";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import lodash, { ObjectChain } from "lodash";
import { nanoid } from "nanoid/non-secure";
import IProject from "@/interfaces/IProject";

interface IDatabase {
  dbType: string;
  projects: Array<IProject>;
  types: Array<unknown>;
  progress: Array<unknown>;
  notes: Array<unknown>;
  projectLexicon: Array<unknown>;
  lexicon: Array<unknown>;
  words: Array<unknown>;
}

// Needed to include the chain function w/o errors
interface ILowDb extends LowSync<IDatabase> {
  chain: ObjectChain<IDatabase>;
}

export default class Database {
  #app: App;
  #isTestEnv: string | undefined;
  #getDbPath: () => string;

  public db: ILowDb;
  public generateUniqueId: (item: IProject) => IProject;

  constructor(app: App) {
    this.#getDbPath = (): string => {
      const userDataDirPath = this.#app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const loadDatabase = (): ILowDb => {
      const adapter =
        this.#isTestEnv === "test"
          ? new MemorySync<IDatabase>() // in-memory test database
          : new JSONFileSync<IDatabase>(this.#getDbPath());

      const db = new LowSync<IDatabase>(adapter) as ILowDb;

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
      item._id = nanoid(21);
      return item;
    };
  }
}
