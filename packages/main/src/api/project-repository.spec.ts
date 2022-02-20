/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Database, initializeDatabase } from "../database";
import ProjectRepository from "./project-repository";

describe("project-repository", () => {
  let database: Database;
  let projectRepository: ProjectRepository;
  const dateForIt = new Date();
  const dateForShining = new Date();

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    database = new Database(initDb);
    projectRepository = new ProjectRepository(database);
    database.db.data!.types = [
      {
        id: "1",
        value: "novel",
      },
      {
        id: "2",
        value: "short story",
      },
    ];
    database.db.data!.projects = [
      {
        id: "1",
        title: "It",
        description: "An evil clown attacks a town.",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: dateForIt,
        dateModified: dateForIt,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper.",
        typeId: "2",
        completed: false,
        archived: false,
        dateCreated: dateForShining,
        dateModified: dateForShining,
      },
    ];
    database.db.data!.goals = [
      {
        id: "1",
        projectId: "1",
        isDaily: false,
        daysPerMonth: 14,
        wordCount: 500,
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ];
  });

  it("getAll - can get all projects", () => {
    const projects = projectRepository.getAll();
    expect(projects).toEqual([
      {
        id: "1",
        title: "It",
        description: "An evil clown attacks a town.",
        typeId: "1",
        type: {
          id: "1",
          value: "novel",
        },
        goals: [
          {
            id: "1",
            projectId: "1",
            isDaily: false,
            daysPerMonth: 14,
            wordCount: 500,
            proofreadCountsTowardGoal: true,
            editCountsTowardGoal: true,
            revisedCountsTowardsGoal: true,
            active: true,
            completed: false,
          },
        ],
        completed: false,
        archived: false,
        dateCreated: dateForIt,
        dateModified: dateForIt,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper.",
        typeId: "2",
        type: {
          id: "2",
          value: "short story",
        },
        goals: [],
        completed: false,
        archived: false,
        dateCreated: dateForShining,
        dateModified: dateForShining,
      },
    ]);
  });

  it("getByTitle - returns project by title", () => {
    const project = projectRepository.getByTitle("The Shining");
    expect(project).toEqual({
      id: "2",
      title: "The Shining",
      description: "An evil hotel possesses a groundskeeper.",
      typeId: "2",
      type: {
        id: "2",
        value: "short story",
      },
      goals: [],
      completed: false,
      archived: false,
      dateCreated: dateForShining,
      dateModified: dateForShining,
    });
  });

  it("getByTitle - returns undefined when getting project by title not in db", () => {
    const project = projectRepository.getByTitle("The Dead Zone");
    expect(project).toBeUndefined();
  });

  it("getById - returns project by id", () => {
    const project = projectRepository.getById("2");
    expect(project).toEqual({
      id: "2",
      title: "The Shining",
      description: "An evil hotel possesses a groundskeeper.",
      typeId: "2",
      type: {
        id: "2",
        value: "short story",
      },
      goals: [],
      completed: false,
      archived: false,
      dateCreated: dateForShining,
      dateModified: dateForShining,
    });
  });

  it("getById - returns undefined when project by id not in database", () => {
    const project = projectRepository.getById("100");
    expect(project).toBeUndefined();
  });

  it("add - returns added project", async () => {
    const date = new Date();
    const newProject = {
      title: "The Dead Zone",
      description:
        "An evil man becomes president and could cause a nuclear war.",
      typeId: "1",
      completed: false,
      archived: false,
      dateCreated: date,
      dateModified: date,
    };
    const addedProject = await projectRepository.add(newProject);
    expect(addedProject.title).toEqual("The Dead Zone");
    const projectCount = projectRepository.getAll().length;
    expect(projectCount).toEqual(3);
  });

  it("update - returns updated project", async () => {
    const dateModified = new Date();
    const updatedProject = {
      id: "1",
      title: "It - by S.K.",
      description: "It's really scary",
      typeId: "1",
      completed: false,
      archived: false,
      dateCreated: dateForIt,
      dateModified: dateModified,
    };
    const response = await projectRepository.update(updatedProject);
    expect(response).toEqual({
      id: "1",
      title: "It - by S.K.",
      description: "It's really scary",
      typeId: "1",
      type: {
        id: "1",
        value: "novel",
      },
      goals: [
        {
          id: "1",
          projectId: "1",
          isDaily: false,
          daysPerMonth: 14,
          wordCount: 500,
          proofreadCountsTowardGoal: true,
          editCountsTowardGoal: true,
          revisedCountsTowardsGoal: true,
          active: true,
          completed: false,
        },
      ],
      completed: false,
      archived: false,
      dateCreated: dateForIt,
      dateModified: dateModified,
    });
  });

  it("delete - returns void when project deleted", async () => {
    await projectRepository.delete("1");
    const projects = projectRepository.getAll();
    expect(projects.length).toEqual(1);
  });
});
