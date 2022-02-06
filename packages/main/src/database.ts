import { nanoid } from "nanoid/non-secure";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";
import type { App, Rectangle } from "electron";
import type { Goal, Note, Progress, Project, Type } from "interfaces";

interface VislitDatabase {
  dbType: string;
  dbVersion: string;
  windowBounds: Rectangle | undefined;
  projects: Project[];
  types: Type[];
  goals: Goal[];
  progress: Progress[];
  notes: Note[];
}

export default class Database {
  public db: LowSync<VislitDatabase>;
  public generateUniqueId: (item: any) => any;

  #app: App;
  #getDbPath: () => string;

  constructor(app: App) {
    this.#getDbPath = (): string => {
      const userDataDirPath = this.#app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const loadDatabase = (): LowSync<VislitDatabase> => {
      const adapter =
        process.env.NODE_ENV === "test"
          ? new MemorySync<VislitDatabase>() // in-memory test database
          : new JSONFileSync<VislitDatabase>(this.#getDbPath());
      const db = new LowSync<VislitDatabase>(adapter);

      db.read();

      if (db.data === null) {
        // Set default database structure
        db.data = {
          dbType: "vislit",
          dbVersion: "1.0.0", // check version number to decide if database needs to be updated
          windowBounds: undefined,
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

      return db;
    };

    this.#app = app;
    this.db = loadDatabase();
    this.generateUniqueId = (item: any) => {
      item.id = nanoid(13);
      return item;
    };
  }
}
