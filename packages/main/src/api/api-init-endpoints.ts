import { ipcMain } from "electron";
import type DataPath from "../data-path";
import type Dialogs from "./dialogs";
import type FileSystemController from "./file-system-controller";
import type GoalController from "./goal-controller";
import type NoteController from "./note-controller";
import type ProgressController from "./progress-controller";
import type ProjectController from "./project-controller";
import type TypeController from "./type-controller";
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
} from "./request-schemas";

export default function initializeApiEndpoints(
  dataPath: DataPath,
  dialogs: Dialogs,
  projectController: ProjectController,
  typeController: TypeController,
  goalController: GoalController,
  progressController: ProgressController,
  noteController: NoteController,
  fileSystemController: FileSystemController
) {
  // TODO: CHECK IF ALL THESE NEED TO await
  /**
   * Dialogs
   */
  // TODO: Dialogs need to be an Class passed into initializer
  // ipcMain.handle("dialog-fetch-error", () => showFetchErrorDialog());

  ipcMain.handle(
    "dialog-data-link-non-taskbar",
    async () => await dialogs.showDataLinkDialog()
  );

  ipcMain.handle("dialog-change-save-location", () => {
    // TODO:
    // copy the vislit-data folder to the new location
    // datapath.set(newLocation)
    // database.reload()
  });

  ipcMain.handle("data-path-get", () => {
    return dataPath.get();
  });

  /**
   * Projects
   */
  ipcMain.handle("projects-get-all", () => projectController.getAll());

  ipcMain.handle("projects-add", (_e, request: projectAddRequest) =>
    projectController.add(request)
  );

  ipcMain.handle("projects-update", (_e, request: projectUpdateRequest) =>
    projectController.update(request)
  );

  ipcMain.handle("projects-delete", (_e, request: idRequest) =>
    projectController.delete(request)
  );

  /**
   * Search
   */
  // TODO:
  // implement: note search
  // implement: project search endpoint

  /**
   * Types
   */
  ipcMain.handle("types-get-all", () => typeController.getAll());

  ipcMain.handle("types-add", (_e, value: typeAddRequest) =>
    typeController.add(value)
  );

  ipcMain.handle("types-delete", (_e, id: idRequest) =>
    typeController.delete(id)
  );

  /**
   * Goals
   */
  ipcMain.handle("goals-add", (_e, goal: addGoalRequest) =>
    goalController.add(goal)
  );

  ipcMain.handle("goals-update", (_e, request: updateGoalRequest) =>
    goalController.update(request)
  );

  ipcMain.handle("goals-delete", (_e, id: idRequest) =>
    goalController.delete(id)
  );

  ipcMain.handle("goals-completed", (_e, id: idRequest) =>
    goalController.setCompletedById(id)
  );

  /**
   * Progress
   */
  ipcMain.handle(
    "progress-get-all-by-year-month",
    (_e, request: getAllProgressRequest) => progressController.getAll(request)
  );

  ipcMain.handle(
    "progress-get-by-date",
    (_e, request: getProgressByDateRequest) =>
      progressController.getByDate(request)
  );

  ipcMain.handle("progress-modify", (_e, progress: modifyProgressRequest) =>
    progressController.modify(progress)
  );

  /**
   * Writer
   */
  ipcMain.handle("writer-get-most-recent", (_e, id: idRequest) =>
    fileSystemController.readMostRecentHtmlFile(id)
  );

  /**
   * Notes
   */
  ipcMain.handle("notes-get-all-by-project-id", (_e, id: idRequest) =>
    noteController.getAllByProjectId(id)
  );

  ipcMain.handle("notes-get-by-id", (_e, id: idRequest) =>
    noteController.getById(id)
  );

  ipcMain.handle("notes-add", (_e, request: addNoteRequest) =>
    noteController.add(request)
  );

  ipcMain.handle("notes-update", (_e, request: updateNoteRequest) =>
    noteController.update(request)
  );

  ipcMain.handle("notes-delete", (_e, id: idRequest) =>
    noteController.delete(id)
  );

  /**
   * Html
   */
  ipcMain.handle("html-save", (_e, request: htmlWriteRequest) =>
    // Stores note or project based on request.type
    fileSystemController.writeHtmlFile(request)
  );
}
