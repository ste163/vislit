import { app, dialog } from "electron";
import { readdir, mkdir, copyFile } from "fs/promises";
import { join } from "path";

// move this into a helper? Or into the fs-controller?
// dialogs probably shouldn't be what's controlling copy/paste dir
// https://stackoverflow.com/questions/39106516/node-fs-copy-a-folder
async function copyDir(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await copyFile(srcPath, destPath);
  }
}

export function showFetchErrorDialog(): void {
  // TODO: add link to github issues
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

  // QUESTION: should there be a date now? Probably not

  const result = await dialog.showSaveDialog({
    title: "Export Vislit Database",
    defaultPath: `${homePath}/${formattedDate}_vislit-data`,
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
      const dataPath = `${app.getPath("userData")}/vislit-data`;
      await copyDir(dataPath, result.filePath);
    } catch (error: any | Error) {
      dialog.showErrorBox(
        "Export failed",
        `Unable to export database. Export operation failed. Error: ${error}`
      );
    }
  }
}

export async function showImportDialog(): Promise<void> {
  // imports the entire vislit-data folder
  console.log("Link to new data folder");
}

export async function showImportWarningDialog(): Promise<void> {
  // TODO: only show the export button if we're NOT on the welcome page
  // otherwise, you'd export an empty database
  // NOTE: We're not importing data, we're reading from a new location
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
      showImportDialog();
      break;
    case 1:
      showExportDialog();
      break;
    default:
      break;
  }
}
