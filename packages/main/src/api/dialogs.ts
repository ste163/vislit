import type { BrowserWindow } from "electron";
import { app, dialog } from "electron";
import { readdir, mkdir, copyFile } from "fs/promises";
import { join } from "path";
import { mainWindow } from "../index"; // import here so it's outside of unit tests (import index in tests crashes tests)
import type DataPath from "../data-path";

export default class Dialogs {
  constructor(
    private dataPath: DataPath,
    private reloadDatabase: (mainWindow: BrowserWindow) => Promise<void>
  ) {}

  async #copyDir(src: string, dest: string): Promise<void> {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      entry.isDirectory()
        ? await this.#copyDir(srcPath, destPath)
        : await copyFile(srcPath, destPath);
    }
  }

  showFetchError(): void {
    // TODO: add link to github issues
    // or in future: a bug report on vislit.app
    // that doesn't require a sign up
    dialog.showErrorBox(
      "Vislit: Fatal Error",
      "Failed to load data from database. Restart the app. If that fails to solve the issue, report the issue at GITHUBLINK"
    );
  }

  async showChangeSaveLocation(): Promise<void> {
    const newLocation = (await this.showExport()) as string; // throws error if it fails
    if (newLocation) {
      try {
        this.dataPath.set(newLocation);
        // NOTE:
        // force reloading the app with mainWindow.reload
        // this does not change location storage
        // May need to trigger the reload differently/through Vue, but this works for now
        mainWindow?.reload();
        await this.reloadDatabase(mainWindow as BrowserWindow);
      } catch (error: any | Error) {
        dialog.showErrorBox(
          "Changing Save Location failed",
          `Unable to change save location. Linking operation failed. Error: ${error}`
        );
      }
    }
  }

  async showExport(): Promise<string | undefined | Error> {
    const homePath = app.getPath("home"); // open dialog at the home location (usually the desktop)
    const result = await dialog.showSaveDialog({
      title: "Export Vislit Database",
      defaultPath: `${homePath}/vislit-data`,
      properties: ["createDirectory"],
    });

    console.log(result);

    if (result.filePath) {
      try {
        // TODO:
        // This exports just the database.
        // need to export entire /vislit-data
        const path = `${app.getPath("userData")}/vislit-data`;
        await this.#copyDir(path, result.filePath);
        return result.filePath;
      } catch (error: any | Error) {
        dialog.showErrorBox(
          "Export failed",
          `Unable to export database. Export operation failed. Error: ${error}`
        );
        return error;
      }
    }
  }

  async showDataLink(): Promise<void> {
    const selection = await dialog.showOpenDialog({
      buttonLabel: "Select vislit-data folder",
      defaultPath: app.getPath("home"),
      properties: ["openDirectory"],
    });

    const selectedFilePath = selection.filePaths[0];

    if (selectedFilePath) {
      const filesInDirectory = await readdir(selection.filePaths[0]);
      const vislitFiles = filesInDirectory.filter((file) => {
        // These two files must be in the directory to be valid
        // This isn't a super-safe check, but is good enough
        if (file === "vislit-database.json" || file === "projects") {
          return file;
        }
      });

      if (vislitFiles.length !== 2) {
        dialog.showErrorBox(
          "Linking failed",
          "Selected folder was not a vislit-data folder"
        );
        // Re-open dialog on failure
        await this.showDataLink();
        // Must return out or else this function will continue after re-showing dialog
        return;
      }

      const newPath = this.dataPath.set(selectedFilePath);
      if (newPath instanceof Error) return; // the error dialog is triggered in dataPath.set()
      mainWindow?.reload();
      await this.reloadDatabase(mainWindow as BrowserWindow);
    }
  }

  async showDataLinkWarning(): Promise<void> {
    // TODO:
    // This warning might not be needed, as there is no data loss.
    // You're just linking to a new file.
    // But this warning would be informative.
    // TODO: only show the export button if we're NOT on the welcome page
    // otherwise, you'd export an empty database
    const result = await dialog.showMessageBox({
      title: "Change data location",
      message: "Warning",
      detail:
        "Change where Vislit reads data. This could be from a cloud directory on your system or another location like the desktop.",
      buttons: [
        "Select new 'vislit-data' folder to read from",
        "Export current 'vislit-data' folder",
        "Cancel",
      ],
    });

    // Todo: don't use switch
    switch (result.response) {
      case 0:
        await this.showDataLink();
        break;
      case 1:
        await this.showExport();
        break;
      default:
        break;
    }
  }
}
