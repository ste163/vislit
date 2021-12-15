import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";
import { existsSync, mkdirSync } from "fs";
import type { ProjectModel } from "interfaces";
import Database from "./api/database";
import FileSystemController from "./api/controllers/fileSystemController";
import ProjectRepository from "./api/repositories/projectRepository";
import ProjectController from "./api/controllers/projectController";
import SearchController from "./api/controllers/searchController";
import type ProjectControllerModel from "./api/interfaces/ProjectControllerModel";

// declared outside of try block so it can be accessed by IPC
let projectController: ProjectControllerModel;

// For now, instantiate db, controllers, & repos here
try {
  const database = new Database(app);
  const fileSystemController = new FileSystemController(
    app.getPath("userData")
  );
  const projectRepository = new ProjectRepository(database);
  const searchController = new SearchController(projectRepository);
  projectController = new ProjectController(
    projectRepository,
    searchController,
    fileSystemController
  );
} catch (error) {
  console.log(error);
}

// For now, check for projects & notes directories here
try {
  const userDataPath = app.getPath("userData");
  console.log(userDataPath);
  // linux & windows use different slashes -> is this a problem?
  if (!existsSync(`${userDataPath}/projects`))
    mkdirSync(`${userDataPath}/projects`);
} catch (error) {
  console.log(error);
}

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (import.meta.env.MODE === "development") {
  app
    .whenReady()
    .then(() => import("electron-devtools-installer"))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
    .catch((e) => console.error("Failed install extension:", e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    minWidth: 500,
    minHeight: 400,
    width: 1024,
    height: 768,
    backgroundColor: "#e5e5e5",
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../../preload/dist/index.cjs"),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();

    if (import.meta.env.MODE === "development") {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.MODE === "development" &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname
        ).toString();

  await mainWindow.loadURL(pageUrl);
};

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error("Failed create window:", e));

// Auto-updates
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

// API Endpoints
ipcMain.handle("projects-get-all", () => {
  return projectController.getAll();
});

ipcMain.handle("projects-add", (_e, project: ProjectModel) => {
  return projectController.add(project);
});

ipcMain.handle("projects-update", (_e, project: ProjectModel) => {
  return projectController.update(project);
});

ipcMain.handle("projects-delete", (_e, projectId: string) => {
  return projectController.delete(projectId);
});

// project search endpoint
// project auto-suggestion search endpoint

// writer
ipcMain.handle("writer-save", (_e, html: string) => {
  // should make an object w/ metadata
  // {
  //   projectId: "so we can place it in the correct directory",
  //   html: 'all my stuffs'
  //   createAt: new Date() -> added at this point
  // }
  console.log(html);
  return "Received HTML on backend!";
});
