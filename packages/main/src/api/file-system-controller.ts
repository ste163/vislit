import fs from "fs";
import {
  deleteNoteRequestSchema,
  htmlWriteRequestSchema,
  idRequestSchema,
  readMostRecentHtmlFileRequestSchema,
  readNoteByIdRequestSchema,
} from "../schemas";
import type {
  htmlWriteRequest,
  idRequest,
  deleteNoteRequest,
  readNoteByIdRequest,
  readMostRecentHtmlFileRequest,
} from "../schemas";

class FileSystemController {
  #userDataPath: string;
  constructor(userData: string) {
    this.#userDataPath = userData;
  }

  getUserDataPath(): string {
    return this.#userDataPath;
  }

  makeProjectDirectory(projectId: idRequest): true | Error {
    try {
      idRequestSchema.parse(projectId);
      const userData = this.getUserDataPath();
      fs.mkdirSync(`${userData}/projects/${projectId}`);
      fs.mkdirSync(`${userData}/projects/${projectId}/documents`);
      fs.mkdirSync(`${userData}/projects/${projectId}/notes`);
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  deleteProjectDirectory(projectId: idRequest): true | Error {
    try {
      idRequestSchema.parse(projectId);
      const userData = this.getUserDataPath();
      fs.rmSync(`${userData}/projects/${projectId}`, { recursive: true });
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  writeHtmlFile(request: htmlWriteRequest): true | Error {
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

      fs.writeFileSync(userData, html);
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  deleteNote(request: deleteNoteRequest): true | Error {
    try {
      deleteNoteRequestSchema.parse(request);
      const { id, projectId } = request;
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${id}.html`;
      fs.rmSync(userData); // returns error if unable to find file
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  readNoteById(request: readNoteByIdRequest): string | undefined | Error {
    try {
      readNoteByIdRequestSchema.parse(request);
      const { noteId, projectId } = request;
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${noteId}.html`;
      const file = fs.readFileSync(userData, "utf-8");
      if (file) return file;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  readMostRecentHtmlFile(
    request: readMostRecentHtmlFileRequest
  ): string | void | Error {
    // Notes are stored without dates in filename
    // Database stores note dates
    try {
      readMostRecentHtmlFileRequestSchema.parse(request);
      const { id, type } = request;
      const userData = `${this.getUserDataPath()}/projects/${id}/${type}`;
      const files = fs.readdirSync(userData);
      if (files.length) {
        // for now, assuming last file in list is most recent
        const mostRecentFileName = files[files.length - 1];
        return fs.readFileSync(`${userData}/${mostRecentFileName}`, "utf-8");
      }
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }
}

export default FileSystemController;
