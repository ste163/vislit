import type { ProjectModel } from "interfaces";
import type DatabaseModel from "../interfaces/DatabaseModel";
import type ProjectRespositoryModel from "../interfaces/ProjectRespositoryModel";

export default class ProjectRepository implements ProjectRespositoryModel {
  #database: DatabaseModel;

  constructor(database: DatabaseModel) {
    this.#database = database;
  }

  getAll(): Array<ProjectModel> {
    if (this.#database.db.data !== null) {
      const projects = this.#database.db.data.projects;

      // This will most likely need to move into a util at some point & probably move to having an IDateModified
      const sortedByMostRecent = projects.sort(
        (a: ProjectModel, b: ProjectModel): number => {
          if (a.dateModified !== null && b.dateModified !== null) {
            const aDate = new Date(a.dateModified);
            const bDate = new Date(b.dateModified);

            if (aDate > bDate) {
              return -1;
            } else if (aDate < bDate) {
              return 1;
            } else {
              return 0;
            }
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

  getById(id: string): ProjectModel {
    // TODO:
    // get all linked data (currently just progress)
    // Only use db.chain when you need lodash methods
    return this.#database.db.chain.get("projects").find({ id }).value();
  }

  getByTitle(title: string): ProjectModel {
    return this.#database.db.chain.get("projects").find({ title }).value();
  }

  add(project: ProjectModel): ProjectModel {
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

  update(project: ProjectModel): ProjectModel {
    // Some code duplication from delete & add
    // It's needed because we should only .write()
    // once we're finished updating
    if (this.#database.db.data !== null) {
      this.#database.db.chain
        .get("projects")
        .remove({ id: project.id })
        .value();

      this.#database.db.data.projects.push(project);

      this.#database.db.write();

      const updatedProject = this.getById(project.id);

      return updatedProject;
    } else {
      throw Error("Db data was null");
    }
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
