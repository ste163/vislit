/**
 * @jest-environment node
 */
import { Database, initializeDatabase } from "../database";
import ProjectRepository from "./project-repository";

describe("project-repository", () => {
  let database: Database;
  let projectRepository: ProjectRepository;
  const dateForIt = new Date();
  const dateForShining = new Date();

  beforeEach(async () => {
    const { app } = jest.requireMock("electron");
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
        basedOnWordCountOrPageCount: "word",
        wordOrPageCount: 500,
        frequencyToRepeat: "daily",
        proofreadCountsTowardGoal: true,
        editCountsTowardGoal: true,
        revisedCountsTowardsGoal: true,
        active: true,
        completed: false,
      },
    ];
  });

  it("throws error if project date is null", () => {
    database.db.data!.projects = [
      {
        id: "1",
        title: "It",
        description: "An evil clown attacks a town.",
        typeId: "1",
        completed: false,
        archived: false,
        dateCreated: null,
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
        dateModified: null,
      },
    ];
    try {
      projectRepository.getAll();
    } catch (e: any | Error) {
      expect(e.message).toBe("Project date was null");
    }
  });

  it("can get all projects", () => {
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
            basedOnWordCountOrPageCount: "word",
            wordOrPageCount: 500,
            frequencyToRepeat: "daily",
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

  it("returns project by title", () => {
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

  it("returns undefined when getting project by title not in db", () => {
    const project = projectRepository.getByTitle("The Dead Zone");
    expect(project).toBeUndefined();
  });

  it("returns project by id", () => {
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

  it("returns undefined when project by id not in database", () => {
    const project = projectRepository.getById("100");
    expect(project).toBeUndefined();
  });

  it("returns added project", async () => {
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

  it("returns updated project", async () => {
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
          basedOnWordCountOrPageCount: "word",
          wordOrPageCount: 500,
          frequencyToRepeat: "daily",
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

  it("returns void when project deleted", async () => {
    projectRepository.delete("1");
    const projects = await projectRepository.getAll();
    expect(projects.length).toEqual(1);
  });
});
