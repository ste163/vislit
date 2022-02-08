import fs from "fs";
import { htmlWriteRequestSchema, idRequestSchema } from "../schemas";
import type { htmlWriteRequest, idRequest } from "../schemas";

export type htmlData = {
  id: string; // projectId or noteId
  html: string;
  type: "documents" | "notes";
  projectId?: string; // notes need projectId
  createdAt?: Date;
};

class FileSystemController {
  #userDataPath: string;
  constructor(userData: string) {
    this.#userDataPath = userData;
  }

  getUserDataPath(): string {
    return this.#userDataPath;
  }

  makeProjectDirectory(projectId: idRequest): void {
    idRequestSchema.parse(projectId);
    const userData = this.getUserDataPath();
    fs.mkdirSync(`${userData}/projects/${projectId}`);
    fs.mkdirSync(`${userData}/projects/${projectId}/documents`);
    fs.mkdirSync(`${userData}/projects/${projectId}/notes`);
  }

  deleteProjectDirectory(projectId: idRequest): void {
    idRequestSchema.parse(projectId);
    const userData = this.getUserDataPath();
    fs.rmSync(`${userData}/projects/${projectId}`, { recursive: true });
  }

  writeHtmlFile(htmlData: htmlWriteRequest): true | Error {
    try {
      htmlWriteRequestSchema.parse(htmlData);
      // documents save the date for versioning
      // notes do not have versioning, only save id
      const userData =
        htmlData.type === "documents"
          ? `${this.getUserDataPath()}/projects/${htmlData.id}/${
              htmlData.type
            }/${new Date(htmlData.createdAt!).toISOString().split("T")[0]}-${
              htmlData.id
            }.html`
          : `${this.getUserDataPath()}/projects/${htmlData.projectId}/${
              htmlData.type
            }/${htmlData.id}.html`;

      fs.writeFileSync(userData, htmlData.html);
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  deleteNote(id: string, projectId: string): true | Error {
    try {
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${id}.html`;
      fs.rmSync(userData); // will return error if can't find file
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  readNoteById(noteId: string, projectId: string): string | undefined | Error {
    try {
      const userData = `${this.getUserDataPath()}/projects/${projectId}/notes/${noteId}.html`;
      const file = fs.readFileSync(userData, "utf-8");
      if (file) return file;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  readMostRecentHtmlFile(
    id: string,
    type: "documents" | "notes"
  ): string | void | Error {
    // Notes are stored without dates in filename
    // Database stores note dates
    try {
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
