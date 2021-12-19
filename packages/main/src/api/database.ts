import lodash from "lodash";
import { nanoid } from "nanoid/non-secure";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import type { App } from "electron";
import type { Project, Type } from "interfaces";
import type { ObjectChain } from "lodash";

interface VislitDatabase {
  dbType: string;
  projects: Array<Project>;
  types: Array<Type>;
  progress: Array<unknown>;
  notes: Array<unknown>;
  projectLexicons: Array<unknown>;
  lexicons: Array<unknown>;
  words: Array<unknown>;
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
          projects: [],
          types: [
            {
              id: '1',
              type: 'Novel',
              dateCreated: new Date()
            },
            {
              id: '2',
              type: 'Novella',
              dateCreated: new Date()
            },
            {
              id: '3',
              type: 'Memoir',
              dateCreated: new Date()
            },
            {
              id: '4',
              type: 'Short Story',
              dateCreated: new Date()
            },
            {
              id: '5',
              type: 'Short Story Collection',
              dateCreated: new Date()
            },
            {
              id: '6',
              type: 'Poem',
              dateCreated: new Date()
            },
            {
              id: '7',
              type: 'Poetry Collection',
              dateCreated: new Date()
            },
          ],
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
    this.db = loadDatabase();
    this.generateUniqueId = (item: any) => {
      item.id = nanoid(21);
      return item;
    };
  }
}
