import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";
import { existsSync, mkdirSync } from "fs";
import type { Goal, Project } from "interfaces";
import Database from "./api/database";
import FileSystemController from "./api/controllers/file-system-controller";
import ProjectRepository from "./api/repositories/project-repository";
import ProjectController from "./api/controllers/project-controller";
import SearchController from "./api/controllers/search-controller";
import TypeRepository from "./api/repositories/type-repository";
import TypeController from "./api/controllers/type-controller";
import type htmlData from "./api/types/html-data";

// declared outside of try block so it can be accessed by IPC
let projectController: ProjectController;
let fileSystemController: FileSystemController;
let typeController: TypeController;

// For now, instantiate db, controllers, & repos here
try {
  const database = new Database(app);
  fileSystemController = new FileSystemController(app.getPath("userData"));
  const projectRepository = new ProjectRepository(database);
  const typeRepository = new TypeRepository(database);
  const searchController = new SearchController(projectRepository);
  projectController = new ProjectController(
    projectRepository,
    searchController,
    fileSystemController
  );
  typeController = new TypeController(typeRepository);
} catch (error) {
  console.log(error);
}

// For now, check for projects & notes directories here
try {
  const userDataPath = app.getPath("userData");
  console.log("DATA PATH:", userDataPath);
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

ipcMain.handle("projects-add", (_e, project: Project) => {
  return projectController.add(project);
});

ipcMain.handle("projects-update", (_e, project: Project) => {
  return projectController.update(project);
});

ipcMain.handle("projects-delete", (_e, projectId: string) => {
  return projectController.delete(projectId);
});

// project search endpoint
// project auto-suggestion search endpoint

// Types
ipcMain.handle("types-get-all", () => {
  return typeController.getAll();
});

ipcMain.handle("types-add", (_e, value: string) => {
  return typeController.add(value);
});

ipcMain.handle("types-delete", (_e, id: string) => {
  return typeController.delete(id);
});

// Goals
ipcMain.handle("goals-add", (_e, goal: Goal) => {
  console.log(goal);
});

// Writer
ipcMain.handle("writer-get-most-recent", (_e, projectId: string) => {
  return fileSystemController.readMostRecentHtmlFile(projectId, "documents");
});

ipcMain.handle("writer-get-by-id", (_e, projectId: string) => {
  console.log("GET PROJECTS FOR", projectId);
});

ipcMain.handle("writer-save", (_e, data: htmlData) => {
  return fileSystemController.writeHtmlFile(data);
});
