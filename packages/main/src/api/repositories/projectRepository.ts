import type { Project } from "interfaces";
import type Database from "../database";

 class ProjectRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getAll(): Array<Project> {
    if (this.#database.db.data !== null) {
      const projects = this.#database.db.data.projects;

      const sortedByMostRecent = projects.sort(
        (a: Project, b: Project): number => {
          if (a.dateModified !== null && b.dateModified !== null) {
            const dateA = new Date(a.dateModified);
            const dateB = new Date(b.dateModified);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return 0;
          } else {
            throw Error("Date modified for project was null");
          }
        }
      );
      return sortedByMostRecent;
    } else {
      throw Error("Db data was null");
    }
  }

  getById(id: string): Project {
    // TODO:
    // get all linked data (currently just progress)
    // Only use db.chain when you need lodash methods
    return this.#database.db.chain.get("projects").find({ id }).value();
  }

  getByTitle(title: string): Project {
    return this.#database.db.chain.get("projects").find({ title }).value();
  }

  add(project: Project): Project {
    if (this.#database.db.data !== null) {
      this.#database.db.data.projects.push(
        this.#database.generateUniqueId(project)
      );

      this.#database.db.write();

      const addedProject = this.getByTitle(project.title);

      return addedProject;
    } else {
      throw Error("Db data was null");
    }
  }

  update(project: Project): Project {
    // Some code duplication from delete & add
    // It's needed because we should only .write()
    // once we're finished updating
      this.#database.db.chain
        .get("projects")
        .remove({ id: project.id })
        .value();

      this.#database.db.data?.projects.push(project);

      this.#database.db.write();

      const updatedProject = this.getById(project.id);

      return updatedProject;
    } 
  
  delete(id: string): void {
    // NOTE:
    // Warning modal needs to be very specific on what will be deleted

    // TODO:
    // get all related project data
    // and delete it
    // Because this is not a legit relational #database
    // The ordering does not matter
    this.#database.db.chain.get("projects").remove({ id }).value();

    this.#database.db.write();
  }
}

export default ProjectRepository;
