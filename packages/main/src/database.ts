import { JSONFile, Low, Memory } from "lowdb";
import { nanoid } from "nanoid/non-secure";
import { join } from "path";
import type { BrowserWindow, Rectangle } from "electron";
import type { Goal, Note, Progress, Project, Type } from "interfaces";
import type DataPath from "./data-path";

export interface VislitDatabase {
  dbType: string;
  dbVersion: string;
  windowBounds: Rectangle | undefined;
  projects: Project[];
  types: Type[];
  goals: Goal[];
  progress: Progress[];
  notes: Note[];
}

// Must initialize db outside of class
// as class constructors cannot be async
export async function initializeDatabase(
  dataPath: DataPath
): Promise<Low<VislitDatabase>> {
  try {
    console.log("initializing database");

    const path = join(dataPath.get(), "vislit-database.json");

    const adapter =
      process.env.NODE_ENV === "test"
        ? new Memory<VislitDatabase>() // in-memory test database
        : new JSONFile<VislitDatabase>(path);
    const db = new Low<VislitDatabase>(adapter);

    await db.read();

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
      await db.write();
    }
    console.log("database initialized");
    return db;
  } catch (error: any | Error) {
    console.log(`failed to initialize database. Error: ${error}`);
    return error;
  }
}

export class Database {
  public db: Low<VislitDatabase>;
  // using entire DataPath as passing in dataPath.get failed -> when called was undefined
  private dataPath: DataPath;

  constructor(db: Low<VislitDatabase>, dataPath: DataPath) {
    this.db = db;
    this.dataPath = dataPath;
  }

  public generateId(item: any) {
    item.id = nanoid(13);
    return item;
  }

  public async reload(mainWindow: BrowserWindow) {
    try {
      const path = this.dataPath.get();
      console.log("reloading database from: ", path);
      if (!path)
        throw new Error("Failed to get the vislit-data path to reload from");

      // setup adapter
      const adapter = new JSONFile<VislitDatabase>(
        join(path, "vislit-database.json")
      );
      const newDb = new Low<VislitDatabase>(adapter);
      await newDb.read();
      this.db = newDb;

      // inform renderer
      console.log("database reloaded");
      mainWindow.webContents.send("reload-database");
    } catch (error: any | Error) {
      console.log(error);
      // show error dialog
    }
  }
}
