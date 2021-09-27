import IProject from "@/interfaces/IProject";
import IDatabase from "../interfaces/IDatabase";
import IProjectRepository from "../interfaces/IProjectRepository";

export default class ProjectRepository implements IProjectRepository {
  #database: IDatabase;

  constructor(database: IDatabase) {
    this.#database = database;
  }

  getAll(): Array<IProject> {
    const projects = this.#database.db.data?.projects;
    return projects === undefined ? [] : projects;
  }

  getById(id: string): IProject {
    // TODO:
    // get all linked data (currently just progress)
    // Only use db.chain when you need lodash methods
    return this.#database.db.chain.get("projects").find({ id }).value();
  }

  getByTitle(title: string): IProject {
    return this.#database.db.chain.get("projects").find({ title }).value();
  }

  add(project: IProject): IProject {
    this.#database.db.data?.projects.push(
      this.#database.generateUniqueId(project)
    );

    this.#database.db.write();

    const addedProject = this.getByTitle(project.title);

    return addedProject;
  }

  update(project: IProject): IProject {
    // Some code duplication from delete & add
    // It's needed because we only should .write()
    // Once we're finished updated
    this.#database.db.chain.get("projects").remove({ id: project.id }).value();

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
