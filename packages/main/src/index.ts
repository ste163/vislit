import { app, dialog } from "electron";
import DataPath from "./data-path";
import { restoreOrCreateWindow } from "./main-window";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import initializeApiControllers from "./api/api-init-controllers";
import initializeApiEndpoints from "./api/api-init-endpoints";
import type { BrowserWindow } from "electron";
import type { Database } from "./database";
import type { SearchController } from "./api/search-controller";
import type Dialogs from "./api/dialogs";
import type FileSystemController from "./api/file-system-controller";
import type ProjectController from "./api/project-controller";
import type NoteController from "./api/note-controller";
import type TypeController from "./api/type-controller";
import type GoalController from "./api/goal-controller";
import type ProgressController from "./api/progress-controller";

/**
 * Declare global variables here to ensure they're never cleaned up
 */
let database: Database;
let dialogs: Dialogs;
let fileSystemController: FileSystemController;
let searchController: SearchController; // not used yet, but will be!
let projectController: ProjectController;
let noteController: NoteController;
let typeController: TypeController;
let goalController: GoalController;
let progressController: ProgressController;

/**
 * Store mainWindow for saving window bounds.
 * Exporting mainWindow for sending signals to renderer
 * from other files
 */
export let mainWindow: BrowserWindow | null = null;

/**
 * Calling main() from main process allows for
 * exiting the function if any of the api setup fails
 * otherwise the app attempts to load Chromium
 */
try {
  main();
} catch (error) {
  console.error("Main crashed: ", error);
}

function main() {
  /**
   * Check where vislit-data should exist:
   * By default this is userData/vislit-data
   * But can be user-defined anywhere on their system
   */
  const dataPath = new DataPath();
  if (dataPath instanceof Error) {
    dialog.showErrorBox(
      "Vislit: Fatal Error",
      `Unable to load or create vislit-data location file. ${dataPath}`
    );
    return;
  }

  /**
   * Create needed directories if they do not already exist
   */
  try {
    let savedDataLocation: string | null = dataPath.get();
    if (!existsSync(savedDataLocation)) {
      const projectDirectory = join(savedDataLocation, "projects");
      mkdirSync(savedDataLocation);
      mkdirSync(projectDirectory);
    }
    savedDataLocation = null; // cleanup memory
  } catch (error) {
    dialog.showErrorBox(
      "Vislit: Fatal Error",
      `Unable to load or create folders required for Vislit. ${error}`
    );
    return;
  }

  /**
   * Prevent multiple instances
   */
  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
    process.exit(0);
  }
  app.on("second-instance", () => {
    restoreOrCreateWindow(database);
  });

  /**
   * Disable Hardware Acceleration for improved power saving
   */
  app.disableHardwareAcceleration();

  /**
   * Shut down background process if all windows were closed
   */
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  /**
   * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
   */
  app.on("activate", () => {
    restoreOrCreateWindow(database);
  });

  /**
   * Create app window after background process is ready
   */
  app
    .whenReady()
    .then(async () => {
      // NOTE: If the startup gets long, show a splash screen before api init
      // initialize database and controllers and assign them for ipc access
      const {
        initDatabase,
        initDialogs,
        initFileSystemController,
        initSearchController,
        initProjectController,
        initNoteController,
        initTypeController,
        initGoalController,
        initProgressController,
      } = await initializeApiControllers(dataPath);

      // TODO/NOTE: this is potentially an unneeded step
      // if these variables never get cleaned up.
      // When the app is more developed, test with using it for
      // a long period of time. If it all works,
      // remove these
      database = initDatabase;
      dialogs = initDialogs;
      fileSystemController = initFileSystemController;
      searchController = initSearchController;
      projectController = initProjectController;
      noteController = initNoteController;
      typeController = initTypeController;
      goalController = initGoalController;
      progressController = initProgressController;

      initializeApiEndpoints(
        dataPath,
        dialogs,
        projectController,
        typeController,
        goalController,
        progressController,
        noteController,
        fileSystemController
      );
      console.log("api successfully initialized");
    })
    .then(async () => {
      mainWindow = await restoreOrCreateWindow(database);
    })
    .then(() => {
      // save window bounds to restore window state
      mainWindow?.on("close", async () => {
        try {
          const bounds = mainWindow?.getBounds();
          database.db.data!.windowBounds = bounds;
          await database.db.write();
        } catch (error: any | Error) {
          console.log("Unable to save window bounds", error);
        }
      });
    })
    .catch((e) => console.error("Failed create window:", e));

  /**
   * Install Vue devtools in development only
   */
  if (import.meta.env.DEV) {
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

  /**
   * Check new app version in production only
   */
  if (import.meta.env.PROD) {
    app
      .whenReady()
      .then(() => import("electron-updater"))
      .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error("Failed check updates:", e));
  }
}
