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
      // This exports just the database
      // need to also export the database + project directory
      // should probably store all in a vislit-data folder
      // /vislit-data/vislit-database.json
      // /vislit-data/projects/whatever
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

export async function showImportWarningDialog(): Promise<void> {
  const result = await dialog.showMessageBox({
    title: "Import Data",
    message: "Warning",
    detail:
      "Importing data will overwrite currently loaded data. To ensure no data loss, export your current data and back it up.",
    buttons: [
      "Select 'vislit-data' folder to import",
      "Export current 'vislit-data' folder",
      "Cancel",
    ],
  });

  switch (result.response) {
    case 0:
      showImportDialog();
      break;
    case 1:
      showExportDialog();
      break;
    default:
      break;
  }
}

async function showImportDialog(): Promise<void> {
  // imports the entire vislit-data folder
  console.log("IMPORT");
}
