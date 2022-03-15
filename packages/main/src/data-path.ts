import { app } from "electron";
import { JSONFileSync, LowSync } from "lowdb";

interface Path {
  path: string;
}

export default class DataPath {
  #dataPath: LowSync<Path>;

  constructor() {
    try {
      const adapter = new JSONFileSync<Path>(
        `${app.getPath("userData")}/vislit-data-path.json`
      );
      const dataPath = new LowSync<Path>(adapter);
      dataPath.read();
      // If no data in file, create initial data
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

  public set(): void {
    console.log("SET DATAPATH");
    // need to check that the path the user wants to set it to
    // is actually a vislit-data folder. So it should be:
    // 1. named vislit-data
    // 2. have a vislit-database.json
    // 3. have a /projects directory
    // if not, throw an error
    // if yes, set this as the new data path
    // then call a new method Database.reload() -> that reloads the database
  }
}
