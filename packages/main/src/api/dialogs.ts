import { app, dialog } from "electron";
import { readdir, mkdir, copyFile } from "fs/promises";
import { join } from "path";
import type DataPath from "../data-path";

export default class Dialogs {
  constructor(private dataPath: DataPath) {}

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

  showFetchErrorDialog(): void {
    // TODO: add link to github issues
    // or in future: a bug report on vislit.app
    // that doesn't require a sign up
    dialog.showErrorBox(
      "Vislit: Fatal Error",
      "Failed to load data from database. Restart the app. If that fails to solve the issue, report the issue at GITHUBLINK"
    );
  }

  async showExportDialog() {
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
      } catch (error: any | Error) {
        dialog.showErrorBox(
          "Export failed",
          `Unable to export database. Export operation failed. Error: ${error}`
        );
      }
    }
  }

  async showDataLinkDialog(): Promise<void> {
    console.log(
      "Link to new data folder. Initial folder located at",
      this.dataPath.get()
    );
    // dialog for getting user selection
    // if they have a selection
    // set the updated datapath to link to
    // but set will also need to ensure it's a legit vislit-data folder
    // so it will need to open it and check the contents
    // if it's bad, it'll throw an error
    // this.dataPath.set()
  }

  async showDataLinkWarningDialog(): Promise<void> {
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

    switch (result.response) {
      case 0:
        await this.showDataLinkDialog();
        break;
      case 1:
        await this.showExportDialog();
        break;
      default:
        break;
    }
  }
}
