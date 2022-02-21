import { ipcMain } from "electron";
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
} from "../schemas";

export default function initializeApiEndpoints(
  projectController: ProjectController,
  typeController: TypeController,
  goalController: GoalController,
  progressController: ProgressController,
  noteController: NoteController,
  fileSystemController: FileSystemController
) {
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

  // **********************
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

  // **********************
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

  // **********************
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

  // **********************
  // Writer
  ipcMain.handle("writer-get-most-recent", (_e, id: idRequest) => {
    return fileSystemController.readMostRecentHtmlFile(id);
  });

  // **********************
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

  // **********************
  // Html
  ipcMain.handle("html-save", (_e, request: htmlWriteRequest) => {
    // Stores note or project based on htmlData.type
    return fileSystemController.writeHtmlFile(request);
  });
}
