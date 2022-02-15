// probs make a return type cause the return type could get pretty huge

import { app } from "electron";
import FileSystemController from "./api/file-system-controller";
import GoalController from "./api/goal-controller";
import GoalRepository from "./api/goal-repository";
import NoteController from "./api/note-controller";
import NoteRepository from "./api/note-repository";
import ProgressController from "./api/progress-controller";
import ProgressRepository from "./api/progress-repository";
import ProjectController from "./api/project-controller";
import ProjectRepository from "./api/project-repository";
import SearchController from "./api/search-controller";
import TypeController from "./api/type-controller";
import TypeRepository from "./api/type-repository";
import Database from "./database";

type initializedApi = {
  initDatabase: Database;
  initFileSystemController: FileSystemController;
  initSearchController: SearchController;
  initProjectController: ProjectController;
  initNoteController: NoteController;
  initTypeController: TypeController;
  initGoalController: GoalController;
  initProgressController: ProgressController;
};

async function initializeApi(): Promise<initializedApi> {
  try {
    console.log("INITIALIZE");

    const initDatabase = new Database(app);
    const initFileSystemController = new FileSystemController(
      app.getPath("userData")
    );

    const projectRepository = new ProjectRepository(initDatabase);
    const typeRepository = new TypeRepository(initDatabase);
    const goalRepository = new GoalRepository(initDatabase);
    const progressRepository = new ProgressRepository(initDatabase);
    const noteRepository = new NoteRepository(initDatabase);

    const initSearchController = new SearchController(initDatabase);
    const initProjectController = new ProjectController(
      projectRepository,
      initSearchController,
      initFileSystemController
    );
    const initNoteController = new NoteController(
      noteRepository,
      initSearchController,
      initFileSystemController
    );
    const initTypeController = new TypeController(typeRepository);
    const initGoalController = new GoalController(
      goalRepository,
      initProjectController
    );
    const initProgressController = new ProgressController(
      progressRepository,
      goalRepository,
      initProjectController
    );

    return {
      initDatabase,
      initFileSystemController,
      initSearchController,
      initProjectController,
      initNoteController,
      initTypeController,
      initGoalController,
      initProgressController,
    };
  } catch (error: any | Error) {
    console.log("Failed to initialize api");
    console.error(error);
    return error;
  }
}

export default initializeApi;
