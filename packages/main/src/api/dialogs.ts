import { app, dialog } from "electron";
import { copyFile } from "fs/promises";

export function showFetchErrorDialog(): void {
  // todo: add link to github issues
  // or in future: a bug report on vislit.app
  // that doesn't require a sign up
  dialog.showErrorBox(
    "Vislit: Fatal Error",
    "Failed to load data from database. Restart the app. If that fails to solve the issue, report the issue at GITHUBLINK"
  );
}

export async function showExportDialog() {
  const formattedDate = new Date().toISOString().split("T")[0];
  const homePath = app.getPath("home");

  const result = await dialog.showSaveDialog({
    title: "Export Vislit Database",
    defaultPath: `${homePath}/${formattedDate}_vislit-database.json`,
    properties: ["createDirectory"],
  });

  console.log(result);

  if (result.filePath) {
    try {
      const databasePath = `${app.getPath("userData")}/vislit-database.json`;
      await copyFile(databasePath, result.filePath);
    } catch (error: any | Error) {
      dialog.showErrorBox(
        "Export failed",
        `Unable to export database. Export operation failed. Error: ${error}`
      );
    }
  }
}

export async function showImportDialog(): Promise<void> {
  const result = await dialog.showMessageBox({
    title: "Import Database",
    message: "Warning",
    detail:
      "Importing a new database will overwrite the currently loaded database. To ensure no data loss, export your current database and back it up.",
    buttons: ["Select database to import", "Export current database", "Cancel"],
  });

  switch (result.response) {
    case 0:
      // this._showImportDialog();
      console.log("import");
      break;
    case 1:
      showExportDialog();
      break;
    default:
      break;
  }
}
