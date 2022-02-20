import type { Goal, Note, Progress, Project } from "interfaces";
import type { Database } from "../database";

class ProjectRepository {
  constructor(private database: Database) {}

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
    const types = this.database.db.data!.types;
    project.type = types.find((type) => project.typeId === type.id);
    return project;
  }

  #includeGoals(project: Project): Project {
    const goals = this.database.db.data!.goals.filter(
      (goal) => goal.projectId === project.id
    );
    const sortedGoals = this.#sortByMostRecentlyModified(goals);
    project.goals = sortedGoals;
    return project;
  }

  getAll(): Project[] {
    const projects = this.database.db.data!.projects;
    const projectsWithTypes = projects.map((project) =>
      this.#includeProjectType(project)
    );
    const projectsWithGoals = projectsWithTypes.map((project) =>
      this.#includeGoals(project)
    );
    return this.#sortByMostRecentlyModified(projectsWithGoals);
  }

  getById(id: string): Project | undefined {
    const project = this.database.db.data?.projects.find(
      (project) => project.id === id
    );
    if (project) {
      const projectWithTypes = this.#includeProjectType(project);
      return this.#includeGoals(projectWithTypes);
    }
  }

  getByTitle(title: string): Project | undefined {
    const project = this.database.db.data?.projects.find(
      (project) => project.title === title
    );
    if (project) {
      const projectWithTypes = this.#includeProjectType(project);
      return this.#includeGoals(projectWithTypes);
    }
  }

  async add(project: Project): Promise<Project> {
    this.database.db.data!.projects.push(
      this.database.generateUniqueId(project)
    );
    await this.database.db.write();
    const addedProject = this.getByTitle(project.title) as Project;
    return addedProject;
  }

  async update(project: Project): Promise<Project> {
    const filteredProjects = this.database.db.data?.projects.filter(
      (p) => p.id !== project.id
    ) as Project[];
    this.database.db.data!.projects = filteredProjects;
    this.database.db.data?.projects.push(project);
    await this.database.db.write();
    return this.getById(project.id!) as Project;
  }

  async delete(id: string): Promise<void> {
    const filteredNotes = this.database.db.data?.notes.filter(
      (note) => note.projectId !== id
    ) as Note[];
    this.database.db.data!.notes = filteredNotes;

    const filteredGoals = this.database.db.data?.goals.filter(
      (goal) => goal.projectId !== id
    ) as Goal[];
    this.database.db.data!.goals = filteredGoals;

    const filteredProgress = this.database.db.data?.progress.filter(
      (progress) => progress.projectId !== id
    ) as Progress[];
    this.database.db.data!.progress = filteredProgress;

    const filteredProjects = this.database.db.data?.projects.filter(
      (project) => project.id !== id
    ) as Project[];
    this.database.db.data!.projects = filteredProjects;

    await this.database.db.write();
  }
}

export default ProjectRepository;
