import { app, dialog } from "electron";
import { JSONFileSync, LowSync } from "lowdb";

interface Path {
  path: string;
}

export default class DataPath {
  // Must be synchronous as it's needed before any other event can occur
  #dataPath: LowSync<Path>;

  constructor() {
    try {
      const adapter = new JSONFileSync<Path>(
        `${app.getPath("userData")}/vislit-data-path.json`
      );
      const dataPath = new LowSync<Path>(adapter);
      dataPath.read();
      // If no file found, create one
      if (!dataPath.data) {
        dataPath.data = {
          path: `${app.getPath("userData")}/vislit-data`,
        };
        dataPath.write();
      }
      this.#dataPath = dataPath;
    } catch (error: any | Error) {
      console.error(`Error instantiating DataPath. Error:${error}`);
      this.#dataPath = error; // typescript needs it definitely assigned
    }
  }

  public get(): string {
    return this.#dataPath.data!.path;
  }

  // Path coming into set is already confirmed to be a valid vislit-data directory
  public set(path: string): string | Error {
    try {
      console.log("set data-path to: ", path);
      this.#dataPath.data!.path = path;
      this.#dataPath.write();
      return this.#dataPath.data!.path;
      // data-path has no knowledge of the database
      // so reloading the database should not be called here
    } catch (error: any | Error) {
      dialog.showErrorBox(
        "Linking vislit-data failed",
        `Link operation failed with error: ${error}`
      );
      return error;
    }
  }
}
