import { mkdir, rm, writeFile, readFile, readdir } from "fs/promises";
import { join } from "path";
import handleError from "./util-handle-error";
import {
  deleteNoteRequestSchema,
  htmlWriteRequestSchema,
  idRequestSchema,
  readNoteByIdRequestSchema,
} from "./request-schemas";
import type {
  htmlWriteRequest,
  idRequest,
  deleteNoteRequest,
  readNoteByIdRequest,
} from "./request-schemas";
import type DataPath from "../data-path";

class FileSystemController {
  constructor(private dataPath: DataPath) {}

  async makeProjectDirectory(projectId: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(projectId);
      const projectPath = join(this.dataPath.get(), "projects", projectId);
      const projectDocumentsPath = join(
        this.dataPath.get(),
        "projects",
        projectId,
        "documents"
      );
      const projectNotesPath = join(
        this.dataPath.get(),
        "projects",
        projectId,
        "notes"
      );
      await mkdir(projectPath);
      await mkdir(projectDocumentsPath);
      await mkdir(projectNotesPath);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async deleteProjectDirectory(projectId: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(projectId);
      const projectPath = join(this.dataPath.get(), "projects", projectId);
      await rm(projectPath, {
        recursive: true,
      });
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async writeHtmlFile(request: htmlWriteRequest): Promise<true | Error> {
    try {
      htmlWriteRequestSchema.parse(request);
      const { id, html, type, projectId, createdAt } = request;
      // documents save the date for versioning
      // notes do not have versioning, only save id
      const todaysDate = createdAt
        ? new Date(createdAt).toISOString().split("T")[0]
        : null;
      const documentsPath = join(
        this.dataPath.get(),
        "projects",
        id,
        type,
        `${todaysDate}-${id}.html`
      );
      const notesPath = join(
        this.dataPath.get(),
        "projects",
        projectId!,
        type,
        `${id}.html`
      );
      const pathToSaveData = type === "documents" ? documentsPath : notesPath;
      await writeFile(pathToSaveData, html);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async deleteNote(request: deleteNoteRequest): Promise<true | Error> {
    try {
      deleteNoteRequestSchema.parse(request);
      const { id, projectId } = request;
      const notePath = join(
        this.dataPath.get(),
        "projects",
        projectId,
        "notes",
        `${id}.html`
      );
      await rm(notePath); // returns error if unable to find file
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async readNoteById(
    request: readNoteByIdRequest
  ): Promise<string | Error | undefined> {
    try {
      readNoteByIdRequestSchema.parse(request);
      const { noteId, projectId } = request;
      const notePath = join(
        this.dataPath.get(),
        "projects",
        projectId,
        "notes",
        `${noteId}.html`
      );
      const file = await readFile(notePath, "utf-8");
      if (file) return file;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async readMostRecentHtmlFile(
    projectId: idRequest
  ): Promise<string | void | Error> {
    try {
      idRequestSchema.parse(projectId);
      const documentsPath = join(
        this.dataPath.get(),
        "projects",
        projectId,
        "documents"
      );
      const files = await readdir(documentsPath);
      if (files.length) {
        // for now, assuming last file in list is most recent
        const mostRecentFileName = files[files.length - 1];
        const filePath = join(documentsPath, mostRecentFileName);
        return await readFile(filePath, "utf-8");
      }
    } catch (error: any | Error) {
      return handleError(error);
    }
  }
}

export default FileSystemController;
