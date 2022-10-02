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
  /**
   * Dialogs
   */
  ipcMain.handle("dialog-fetch-error", () => dialogs.showFetchError());

  ipcMain.handle(
    "dialog-data-link-non-taskbar",
    async () => await dialogs.showDataLink()
  );

  ipcMain.handle(
    "dialog-change-save-location",
    async () => await dialogs.showChangeSaveLocation()
  );

  ipcMain.handle("data-path-get", () => {
    return dataPath.get();
  });

  /**
   * Projects
   */
  ipcMain.handle("projects-get-all", () => projectController.getAll());

  ipcMain.handle(
    "projects-add",
    async (_e, request: projectAddRequest) =>
      await projectController.add(request)
  );

  ipcMain.handle(
    "projects-update",
    async (_e, request: projectUpdateRequest) =>
      await projectController.update(request)
  );

  ipcMain.handle(
    "projects-delete",
    async (_e, request: idRequest) => await projectController.delete(request)
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

  ipcMain.handle(
    "types-add",
    async (_e, value: typeAddRequest) => await typeController.add(value)
  );

  ipcMain.handle(
    "types-delete",
    async (_e, id: idRequest) => await typeController.delete(id)
  );

  /**
   * Goals
   */
  ipcMain.handle(
    "goals-add",
    async (_e, goal: addGoalRequest) => await goalController.add(goal)
  );

  ipcMain.handle(
    "goals-update",
    async (_e, request: updateGoalRequest) =>
      await goalController.update(request)
  );

  ipcMain.handle(
    "goals-delete",
    async (_e, id: idRequest) => await goalController.delete(id)
  );

  ipcMain.handle(
    "goals-completed",
    async (_e, id: idRequest) => await goalController.setCompletedById(id)
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

  ipcMain.handle(
    "progress-modify",
    async (_e, progress: modifyProgressRequest) =>
      await progressController.modify(progress)
  );

  /**
   * Writer
   */
  ipcMain.handle(
    "writer-get-most-recent",
    async (_e, id: idRequest) =>
      await fileSystemController.readMostRecentHtmlFile(id)
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

  ipcMain.handle(
    "notes-add",
    async (_e, request: addNoteRequest) => await noteController.add(request)
  );

  ipcMain.handle(
    "notes-update",
    async (_e, request: updateNoteRequest) =>
      await noteController.update(request)
  );

  ipcMain.handle(
    "notes-delete",
    async (_e, id: idRequest) => await noteController.delete(id)
  );

  /**
   * Html
   */
  ipcMain.handle(
    "html-save",
    async (_e, request: htmlWriteRequest) =>
      // Stores note or project based on request.type
      await fileSystemController.writeHtmlFile(request)
  );
}
