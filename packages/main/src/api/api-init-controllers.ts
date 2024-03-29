import type DataPath from "../data-path";
import { Database, initializeDatabase } from "../database";
import Dialogs from "./dialogs";
import FileSystemController from "./file-system-controller";
import GoalController from "./goal-controller";
import GoalRepository from "./goal-repository";
import NoteController from "./note-controller";
import NoteRepository from "./note-repository";
import ProgressController from "./progress-controller";
import ProgressRepository from "./progress-repository";
import ProjectController from "./project-controller";
import ProjectRepository from "./project-repository";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import TypeController from "./type-controller";
import TypeRepository from "./type-repository";

type initializedApi = {
  initDatabase: Database;
  initDialogs: Dialogs;
  initFileSystemController: FileSystemController;
  initSearchController: SearchController;
  initProjectController: ProjectController;
  initNoteController: NoteController;
  initTypeController: TypeController;
  initGoalController: GoalController;
  initProgressController: ProgressController;
};

async function initializeApiControllers(
  dataPath: DataPath
): Promise<initializedApi> {
  try {
    console.log("initializing api");

    const db = await initializeDatabase(dataPath);
    const initDatabase = new Database(db, dataPath);
    const initDialogs = new Dialogs(dataPath, initDatabase.reload as any); // need to pass the function, not call it: so any type
    const initFileSystemController = new FileSystemController(dataPath);
    const projectRepository = new ProjectRepository(initDatabase);
    const typeRepository = new TypeRepository(initDatabase);
    const goalRepository = new GoalRepository(initDatabase);
    const progressRepository = new ProgressRepository(initDatabase);
    const noteRepository = new NoteRepository(initDatabase);

    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(initDatabase);
    const initSearchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );

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
      initDialogs,
      initFileSystemController,
      initSearchController,
      initProjectController,
      initNoteController,
      initTypeController,
      initGoalController,
      initProgressController,
    };
  } catch (error: any | Error) {
    console.log("failed to initialize api");
    console.error(error);
    // TODO: Need to stop attempting to start app and show error dialog
    return error;
  }
}

export default initializeApiControllers;
