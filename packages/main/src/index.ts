import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";
import { existsSync, mkdirSync } from "fs";
import type { Progress } from "interfaces";
import Database from "./database";
import FileSystemController from "./api/file-system-controller";
import ProjectRepository from "./api/project-repository";
import ProjectController from "./api/project-controller";
import NoteRepository from "./api/note-repository";
import NoteController from "./api/note-controller";
import SearchController from "./api/search-controller";
import TypeRepository from "./api/type-repository";
import TypeController from "./api/type-controller";
import GoalRepository from "./api/goal-repository";
import GoalController from "./api/goal-controller";
import ProgressRepository from "./api/progress-repository";
import ProgressController from "./api/progress-controller";
import type {
  addGoalRequest,
  addNoteRequest,
  getAllProgressRequest,
  getProgressByDateRequest,
  htmlWriteRequest,
  idRequest,
  modifyProgressRequest,
  projectAddRequest,
  projectUpdateRequest,
  typeAddRequest,
  updateGoalRequest,
  updateNoteRequest,
} from "./schemas";

// declared outside of try block so it can be accessed by IPC
let fileSystemController: FileSystemController;
let projectController: ProjectController;
let noteController: NoteController;
let typeController: TypeController;
let goalController: GoalController;
let progressController: ProgressController;

// declared here to access window bounds
let database: Database;

// for now, instantiate db, controllers, & repos here
try {
  database = new Database(app);
  fileSystemController = new FileSystemController(app.getPath("userData"));
  const projectRepository = new ProjectRepository(database);
  const typeRepository = new TypeRepository(database);
  const goalRepository = new GoalRepository(database);
  const progressRepository = new ProgressRepository(database);
  const noteRepository = new NoteRepository(database);
  const searchController = new SearchController(database);
  projectController = new ProjectController(
    projectRepository,
    searchController,
    fileSystemController
  );
  noteController = new NoteController(
    noteRepository,
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
  // restore last window size and location
  const bounds = database.db.data?.windowBounds;
  if (bounds) mainWindow.setBounds(bounds);

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
  .then(() => {
    mainWindow?.on("close", () => {
      try {
        // save window bounds to restore window state
        const bounds = mainWindow?.getBounds();
        database.db.data!.windowBounds = bounds;
        database.db.write();
      } catch (error: any | Error) {
        console.log("Unable to save window bounds", error);
      }
    });
  })
  .catch((e) => console.error("Failed create window:", e));

// auto-updating
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

// api endpoints
ipcMain.handle("projects-get-all", () => {
  return projectController.getAll();
});

ipcMain.handle("projects-add", (_e, request: projectAddRequest) => {
  return projectController.add(request);
});

ipcMain.handle("projects-update", (_e, request: projectUpdateRequest) => {
  return projectController.update(request);
});

ipcMain.handle("projects-delete", (_e, request: idRequest) => {
  return projectController.delete(request);
});

// TODO:
// implement
// note search
// project search endpoint

// Types
ipcMain.handle("types-get-all", () => {
  return typeController.getAll();
});

ipcMain.handle("types-add", (_e, value: typeAddRequest) => {
  return typeController.add(value);
});

ipcMain.handle("types-delete", (_e, id: idRequest) => {
  return typeController.delete(id);
});

// Goals
ipcMain.handle("goals-add", (_e, goal: addGoalRequest) => {
  return goalController.add(goal);
});

ipcMain.handle("goals-update", (_e, request: updateGoalRequest) => {
  return goalController.update(request);
});

ipcMain.handle("goals-delete", (_e, id: idRequest) => {
  return goalController.delete(id);
});

ipcMain.handle("goals-completed", (_e, id: idRequest) => {
  return goalController.setCompletedById(id);
});

// Progress
ipcMain.handle(
  "progress-get-all-by-year-month",
  (_e, request: getAllProgressRequest) => {
    return progressController.getAll(request);
  }
);

ipcMain.handle(
  "progress-get-by-date",
  (_e, request: getProgressByDateRequest) => {
    return progressController.getByDate(request);
  }
);

ipcMain.handle("progress-modify", (_e, progress: modifyProgressRequest) => {
  return progressController.modify(progress);
});

// Writer
ipcMain.handle("writer-get-most-recent", (_e, id: idRequest) => {
  return fileSystemController.readMostRecentHtmlFile(id);
});

// Notes
ipcMain.handle("notes-get-all-by-project-id", (_e, id: idRequest) => {
  return noteController.getAllByProjectId(id);
});

ipcMain.handle("notes-get-by-id", (_e, id: idRequest) => {
  return noteController.getById(id);
});

ipcMain.handle("notes-add", (_e, request: addNoteRequest) => {
  return noteController.add(request);
});

ipcMain.handle("notes-update", (_e, request: updateNoteRequest) => {
  return noteController.update(request);
});

ipcMain.handle("notes-delete", (_e, id: idRequest) => {
  return noteController.delete(id);
});

// Html
ipcMain.handle("html-save", (_e, request: htmlWriteRequest) => {
  // Stores note or project based on htmlData.type
  return fileSystemController.writeHtmlFile(request);
});
