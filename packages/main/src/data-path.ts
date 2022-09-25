import { app, dialog } from "electron";
import { JSONFileSync, LowSync } from "lowdb";
import { join } from "path";
import { existsSync, readdirSync } from "fs";

interface Path {
  path: string;
}

/**
 * DataPath creates and manages the JSON file that holds
 * the route to vislit-data where all data is stored.
 * DataPath is a separate LowDb instance that lives in userData.
 * It works synchronously as it must run before any other part of the application
 */
export default class DataPath {
  #dataPath: LowSync<Path>;

  constructor() {
    try {
      const userData = app.getPath("userData");
      // This json file contains only the path to the users vislit-data directory
      const adapter = new JSONFileSync<Path>(
        join(userData, "vislit-data-path.json")
      );
      const dataPath = new LowSync<Path>(adapter);
      dataPath.read();
      /**
       * If the vislit-datapath.json is empty,
       * which it will be on first setup, assign default
       * vislit-data location. This can be changed on frontend later
       */
      if (!dataPath.data) {
        const vislitDataPath = join(userData, "vislit-data");
        dataPath.data = {
          path: vislitDataPath,
        };
        dataPath.write();
      }
      this.#dataPath = dataPath;
    } catch (error: any | Error) {
      console.error(`Error instantiating DataPath. Error:${error}`);
      this.#dataPath = error; // typescript needs this assigned
    }
  }

  public get(): string {
    const vislitDataExists = existsSync(this.#dataPath.data!.path);
    if (vislitDataExists) return this.#dataPath.data!.path;

    // Have user select where there vislit-data dir is,
    // or reset it to default location
    const showImportDialog = (): string => {
      const selection = dialog.showOpenDialogSync({
        buttonLabel: "Select vislit-data folder",
        defaultPath: app.getPath("home"),
        properties: ["openDirectory"],
      });

      if (!selection) this.get(); // they hit cancel, so re-run get() to hit the error dialogs

      const filesInDirectory = readdirSync(selection![0]);
      // TODO: if this is a good solution, DRY it up!
      // same check from dialogs.ts showDataLink()
      const vislitFiles = filesInDirectory.filter((file) => {
        // These two files must be in the directory to be valid
        // This isn't a super-safe check but is good enough
        if (file === "vislit-database.json" || file === "projects") {
          return file;
        }
      });

      if (vislitFiles.length !== 2) {
        dialog.showErrorBox(
          "Importing failed",
          "Selected folder was not a 'vislit-data' folder"
        );
        showImportDialog(); // re-show dialog on failure
      }
      // Should be a good vislit-data directory
      this.set(selection![0]);
      return this.get();
    };

    const resetDataPath = (): string => {
      this.set(join(app.getPath("userData"), "vislit-data"));
      return this.get();
    };

    const userAction = dialog.showMessageBoxSync({
      title: "Vislit Data Warning",
      message: "Unable to find Vislit Data folder",
      detail: `Vislit was unable to find your vislit-data folder.
This is most likely because are you using a different computer or the 'vislit-data' is in a new location. Re-link Vislit to your 'vislit-data' folder or create a new one.
Note, if you create a new folder, you may still re-import your other data  later.`,
      buttons: [
        "Select a 'vislit-data' folder",
        "Create new 'vislit-data' folder",
        "Cancel",
      ],
    });

    const USER_ACTIONS = {
      0: showImportDialog,
      1: resetDataPath,
      2: () => undefined, // cancel or close button clicked
    } as any;

    return USER_ACTIONS[userAction]();
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
