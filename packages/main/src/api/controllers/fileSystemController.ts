import fs from "fs";
import formatDate from "../helpers/formatDate";
// Why abstract fs functions?
// Because to utilize fs, need file paths exposed by electron's { app }

// TODO:
// Return array of all files in a directory
// Delete an individual file
// Get an individual file by name (related to returning the array as that gives the file name)

interface fileSystemController {
  getUserDataPath: () => string;
  makeProjectDirectory: (projectId: string) => void;
  deleteProjectDirectory: (projectId: string) => void;
}

class FileSystemController implements fileSystemController {
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
    fs.rmdirSync(`${userData}/projects/${projectId}`, { recursive: true });
  }

  writeHtmlFile(htmlData: {
    id: string;
    html: string;
    type: "documents" | "notes";
    createdAt: Date;
  }): true | Error {
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
  ): string | Error | void {
    try {
      const userData = `${this.getUserDataPath()}/projects/${id}/${type}`;
      const files = fs.readdirSync(userData);
      // for now, assuming last file in list is most recent
      const mostRecentFileName = files[files.length - 1];
      return fs.readFileSync(`${userData}/${mostRecentFileName}`, "utf-8");
    } catch (error: any | Error) {
      console.error(error);
      return error;
    }
  }
}

export default FileSystemController;
