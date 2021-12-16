import fs from "fs";
import formatDate from "../helpers/formatDate";
// Why abstract fs functions?
// Because to utilize fs, need file paths exposed by electron's { app }

// TODO:
// write file
// returning list of files in directory
// retreiving files?

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
    type: "projects" | "notes";
    createdAt: string;
  }) {
    try {
      const userData = `${this.getUserDataPath()}/${htmlData.type}/${
        htmlData.id
      }/${formatDate(htmlData.createdAt)}.html`;
      fs.writeFileSync(userData, htmlData.html);
    } catch (error) {
      console.error(error);
    }
  }
}

export default FileSystemController;
