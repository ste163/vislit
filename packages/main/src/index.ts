import { app, dialog } from "electron";
import { getDataPath } from "./handle-data-path";
import { restoreOrCreateWindow } from "./main-window";
import { existsSync, mkdirSync } from "fs";
import initializeApiControllers from "./api/api-init-controllers";
import initializeApiEndpoints from "./api/api-init-endpoints";
import type { BrowserWindow } from "electron";
import type { Database } from "./database";
import type { SearchController } from "./api/search-controller";
import type FileSystemController from "./api/file-system-controller";
import type ProjectController from "./api/project-controller";
import type NoteController from "./api/note-controller";
import type TypeController from "./api/type-controller";
import type GoalController from "./api/goal-controller";
import type ProgressController from "./api/progress-controller";

/**
 * Declare global variables to be passed into needed functions
 */
let dataPath: string | Error;
let database: Database;
let fileSystemController: FileSystemController;
let searchController: SearchController; // not used yet, but will be!
let projectController: ProjectController;
let noteController: NoteController;
let typeController: TypeController;
let goalController: GoalController;
let progressController: ProgressController;

// NOTE:
// If any error occurs, we need to exit out of the main function
// May need to test if all of the app.on, etc. can be inside of a main()
// otherwise we can't 'return' out of an error and the app will continue to run until it hits more errors

/**
 * Check where the vislit-data should exist
 * By reading userData/vislit-data-path.json
 * By default this is userData/vislit-data
 * But can be user-defined anywhere on their system
 */
// TODO ASAP:
// https://nodejs.dev/learn/nodejs-file-paths
// TODO: Remove below line after adding the update datapath (which will exist in the api endpoint, so might not change here?)
// eslint-disable-next-line prefer-const
dataPath = getDataPath() as string;
console.log(`vislit-data location: ${dataPath}`);
if ((dataPath as any) instanceof Error) {
  dialog.showErrorBox(
    "Vislit: Fatal Error",
    `Unable to load or create vislit-data location file. Error: ${dataPath}`
  );
}

/**
 * Create needed directories if they do not already exist
 */
try {
  // TODO: linux/mac & windows use different slashes
  // must create vislit-data dir before /projects
  if (!existsSync(dataPath)) mkdirSync(dataPath);
  if (!existsSync(`${dataPath}/projects`)) mkdirSync(`${dataPath}/projects`);
} catch (error) {
  dialog.showErrorBox(
    "Vislit: Fatal Error",
    `Unable to load or create folders required for Vislit. Error: ${error}`
  );
}

/**
 * Store mainWindow for saving window bounds
 */
let mainWindow: BrowserWindow | null = null;

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
 * Shut down background process if all windows was closed
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
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(async () => {
    // If the startup gets long, show a splash screen before api init
    // initialize database and controllers
    // and assign them for ipc access
    const {
      initDatabase,
      initFileSystemController,
      initSearchController,
      initProjectController,
      initNoteController,
      initTypeController,
      initGoalController,
      initProgressController,
    } = await initializeApiControllers(app);

    database = initDatabase;
    fileSystemController = initFileSystemController;
    searchController = initSearchController;
    projectController = initProjectController;
    noteController = initNoteController;
    typeController = initTypeController;
    goalController = initGoalController;
    progressController = initProgressController;

    initializeApiEndpoints(
      projectController,
      typeController,
      goalController,
      progressController,
      noteController,
      fileSystemController
    );

    console.log("api initialized");
  })
  .then(async () => {
    mainWindow = await restoreOrCreateWindow(database);
  })
  .then(() => {
    mainWindow?.on("close", async () => {
      try {
        // save window bounds to restore window state
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
 * Install Vue devtools in development mode only
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
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}
