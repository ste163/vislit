import type { App } from "electron";
import { JSONFile, Low, Memory } from "lowdb";
import type { Rectangle } from "electron";
import type { Goal, Note, Progress, Project, Type } from "interfaces";
// Must initialize db outside of class
// as class constructors cannot be async

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

async function initializeDatabase(app: App): Promise<Low<VislitDatabase>> {
  try {
    console.log("initializing database");

    const getDbPath = (): string => {
      const userDataDirPath = app.getPath("userData");
      return `${userDataDirPath}/vislit-database.json`;
    };

    const adapter =
      process.env.NODE_ENV === "test"
        ? new Memory<VislitDatabase>() // in-memory test database
        : new JSONFile<VislitDatabase>(getDbPath());
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

    return db;
  } catch (error: any | Error) {
    console.log("failed to initialize database");
    console.error(error);
    return error;
  }
}

export default initializeDatabase;
