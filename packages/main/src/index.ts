import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";
import { existsSync, mkdirSync } from "fs";
import type { Goal, Progress, Project } from "interfaces";
import type { htmlData } from "./api/file-system-controller";
import Database from "./database";
import FileSystemController from "./api/file-system-controller";
import ProjectRepository from "./api/project-repository";
import ProjectController from "./api/project-controller";
import SearchController from "./api/search-controller";
import TypeRepository from "./api/type-repository";
import TypeController from "./api/type-controller";
import GoalRepository from "./api/goal-repository";
import GoalController from "./api/goal-controller";
import ProgressRepository from "./api/progress-repository";
import ProgressController from "./api/progress-controller";

// declared outside of try block so it can be accessed by IPC
let projectController: ProjectController;
let fileSystemController: FileSystemController;
let typeController: TypeController;
let goalController: GoalController;
let progressController: ProgressController;

// For now, instantiate db, controllers, & repos here
try {
  const database = new Database(app);
  fileSystemController = new FileSystemController(app.getPath("userData"));
  const projectRepository = new ProjectRepository(database);
  const typeRepository = new TypeRepository(database);
  const goalRepository = new GoalRepository(database);
  const progressRepository = new ProgressRepository(database);
  const searchController = new SearchController(projectRepository);
  projectController = new ProjectController(
    projectRepository,
    searchController,
    fileSystemController
  );
  typeController = new TypeController(typeRepository);
  goalController = new GoalController(goalRepository, projectController);
  progressController = new ProgressController(
    progressRepository,
    goalRepository,
    projectController
  );
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
      sandbox: true,
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
  return goalController.add(goal);
});

ipcMain.handle("goals-update", (_e, goal: Goal) => {
  return goalController.update(goal);
});

ipcMain.handle("goals-delete", (_e, goalId: string) => {
  return goalController.delete(goalId);
});

ipcMain.handle("goals-completed", (_e, goalId: string) => {
  return goalController.setCompletedById(goalId);
});

// Progress
ipcMain.handle(
  "progress-get-all-by-year-month",
  (_e, dates: { projectId: string; year: string; month: string }) => {
    return progressController.getAll(dates.projectId, dates.year, dates.month);
  }
);

ipcMain.handle(
  "progress-get-by-date",
  (_e, request: { projectId: string; date: string }) => {
    return progressController.getByDate(request.projectId, request.date);
  }
);

ipcMain.handle("progress-modify", (_e, progress: Progress) => {
  // zod schema MUST ensure the date is an ISOstring otherwise, everything breaks
  return progressController.modify(progress);
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
