import type { Project } from "interfaces";
import type Database from "../database";

class ProjectRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  #sortByMostRecentlyModified(array: any[]): any[] {
    const copy = [...array];
    return copy.sort((a: any, b: any): number => {
      const dateA = new Date(a.dateModified);
      const dateB = new Date(b.dateModified);
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });
  }

  #includeProjectType(project: Project): Project {
    const types = this.#database.db.data!.types;
    project.type = types.find((type) => project.typeId === type.id);
    return project;
  }

  #includeGoals(project: Project): Project {
    const goals = this.#database.db.data!.goals.filter(
      (goal) => goal.projectId === project.id
    );
    const sortedGoals = this.#sortByMostRecentlyModified(goals);
    project.goals = sortedGoals;
    return project;
  }

  getAll(): Array<Project> {
    const projects = this.#database.db.data!.projects;
    const projectsWithTypes = projects.map((project) =>
      this.#includeProjectType(project)
    );
    const projectsWithGoals = projectsWithTypes.map((project) =>
      this.#includeGoals(project)
    );
    return this.#sortByMostRecentlyModified(projectsWithGoals);
  }

  getById(id: string): Project {
    const project = this.#database.db.chain
      .get("projects")
      .find({ id })
      .value();
    if (project) {
      const projectWithTypes = this.#includeProjectType(project);
      return this.#includeGoals(projectWithTypes);
    }
    return project; // undefined at this point;
  }

  getByTitle(title: string): Project {
    const project = this.#database.db.chain
      .get("projects")
      .find({ title })
      .value();
    if (project) {
      const projectWithTypes = this.#includeProjectType(project);
      return this.#includeGoals(projectWithTypes);
    }
    return project; // undefined at this point
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
    this.#database.db.chain.get("projects").remove({ id: project.id }).value();
    this.#database.db.data?.projects.push(project);
    this.#database.db.write();
    return this.getById(project.id!);
  }

  delete(id: string): void {
    // TODO:
    // get all related project data
    // and delete it
    // - progress
    // - notes -> delete from controller as this is HTML and not database related
    // -> not deleting Types as those can exist on other projects
    // Because this is not a legit relational #database
    // The ordering does not matter
    this.#database.db.chain.get("goals").remove({ projectId: id }).value();
    this.#database.db.chain.get("projects").remove({ id }).value();
    this.#database.db.write();
  }
}

export default ProjectRepository;
