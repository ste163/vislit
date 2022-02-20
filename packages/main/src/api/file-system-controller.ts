import { mkdir, rm, writeFile, readFile, readdir } from "fs/promises";
import handleError from "./util-handle-error";
import {
  deleteNoteRequestSchema,
  htmlWriteRequestSchema,
  idRequestSchema,
  readNoteByIdRequestSchema,
} from "../schemas";
import type {
  htmlWriteRequest,
  idRequest,
  deleteNoteRequest,
  readNoteByIdRequest,
} from "../schemas";

class FileSystemController {
  constructor(private userDataPath: string) {}

  getUserDataPath(): string {
    return this.userDataPath;
  }

  async makeProjectDirectory(projectId: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(projectId);
      const userData = this.getUserDataPath();
      await mkdir(`${userData}/projects/${projectId}`);
      await mkdir(`${userData}/projects/${projectId}/documents`);
      await mkdir(`${userData}/projects/${projectId}/notes`);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async deleteProjectDirectory(projectId: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(projectId);
      const userData = this.getUserDataPath();
      await rm(`${userData}/projects/${projectId}`, { recursive: true });
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
      const userData =
        type === "documents"
          ? `${this.getUserDataPath()}/projects/${id}/${type}/${
              new Date(createdAt!).toISOString().split("T")[0]
            }-${id}.html`
          : `${this.getUserDataPath()}/projects/${projectId}/${type}/${id}.html`;

      await writeFile(userData, html);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async deleteNote(request: deleteNoteRequest): Promise<true | Error> {
    try {
      deleteNoteRequestSchema.parse(request);
      const { id, projectId } = request;
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${id}.html`;
      await rm(userData); // returns error if unable to find file
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
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${noteId}.html`;
      const file = await readFile(userData, "utf-8");
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
      const userData = `${this.getUserDataPath()}/projects/${projectId}/documents`;
      const files = await readdir(userData);
      if (files.length) {
        // for now, assuming last file in list is most recent
        const mostRecentFileName = files[files.length - 1];
        return await readFile(`${userData}/${mostRecentFileName}`, "utf-8");
      }
    } catch (error: any | Error) {
      return handleError(error);
    }
  }
}

export default FileSystemController;
