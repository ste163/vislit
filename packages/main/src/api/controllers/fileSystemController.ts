import fs from "fs";
import formatDate from "../helpers/formatDate";
import type htmlData from "../types/htmlData";

// TODO:
// Return array of all files in a directory
// Delete an individual file
// Get an individual file by name (related to returning the array as that gives the file name)

class FileSystemController  {
  #userDataPath: string;
  constructor(userData: string) {
    this.#userDataPath = userData;
  }

  getUserDataPath(): string {
    return this.#userDataPath;
  }

  makeProjectDirectory(projectId: string): void {
    const userData = this.getUserDataPath();
    fs.mkdirSync(`${userData}/projects/${projectId}`);
    fs.mkdirSync(`${userData}/projects/${projectId}/documents`);
    fs.mkdirSync(`${userData}/projects/${projectId}/notes`);
  }

  deleteProjectDirectory(projectId: string): void {
    const userData = this.getUserDataPath();
    fs.rmSync(`${userData}/projects/${projectId}`, { recursive: true });
  }

  writeHtmlFile(htmlData: htmlData): true | Error {
    try {
      const userData = `${this.getUserDataPath()}/projects/${htmlData.id}/${
        htmlData.type
      }/${formatDate(htmlData.createdAt)}-${htmlData.id}.html`;
      fs.writeFileSync(userData, htmlData.html);
      return true;
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }

  readMostRecentHtmlFile(
    id: string,
    type: "documents" | "notes"
  ): string | void |Error {
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
