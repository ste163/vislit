/**
 * @jest-environment node
 */
import { App } from "electron";
import Database from "../database";
import IProjectRepository from "../interfaces/IProjectRepository";
import ProjectRepository from "./projectRepository";
// Why only projectRepo integration tests?
// Not enough value with mocking entire database class
// The only unit tests would be if errors were thrown, which I'm testing here

// TODO:
// Add tests for if the Db is null error

let projectRepository: IProjectRepository;

const dateForIt = new Date();
const dateForShining = new Date();

beforeEach(() => {
  const app = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dialog: jest.fn(() => {}), // not needed yet, but will be added later
  };
  const database = new Database(app as unknown as App);
  projectRepository = new ProjectRepository(database);

  // Add mock data to database
  if (database.db.data !== null) {
    database.db.data.projects = [
      {
        id: "1",
        title: "It",
        description: "An evil clown attacks a town.",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: dateForIt,
        dateModified: dateForIt,
      },
      {
        id: "2",
        title: "The Shining",
        description: "An evil hotel possesses a groundskeeper.",
        typeId: 1,
        completed: false,
        archived: false,
        dateCreated: dateForShining,
        dateModified: dateForShining,
      },
    ];
  }
});

test("can get all projects", () => {
  const projects = projectRepository.getAll();

  expect(projects).toEqual([
    {
      id: "1",
      title: "It",
      description: "An evil clown attacks a town.",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: dateForIt,
      dateModified: dateForIt,
    },
    {
      id: "2",
      title: "The Shining",
      description: "An evil hotel possesses a groundskeeper.",
      typeId: 1,
      completed: false,
      archived: false,
      dateCreated: dateForShining,
      dateModified: dateForShining,
    },
  ]);
});

test("can get a project by title", () => {
  const project = projectRepository.getByTitle("The Shining");

  expect(project).toEqual({
    id: "2",
    title: "The Shining",
    description: "An evil hotel possesses a groundskeeper.",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: dateForShining,
    dateModified: dateForShining,
  });
});

test("trying to get project by title not in database returns undefined", () => {
  const project = projectRepository.getByTitle("The Dead Zone");

  expect(project).toBeUndefined();
});

test("can get project by id", () => {
  const project = projectRepository.getById("2");

  expect(project).toEqual({
    id: "2",
    title: "The Shining",
    description: "An evil hotel possesses a groundskeeper.",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: dateForShining,
    dateModified: dateForShining,
  });
});

test("trying to get project by id not in database throws error", () => {
  const project = projectRepository.getById("100");

  expect(project).toBeUndefined();
});

test("can add project to database", () => {
  const date = new Date();

  const newProject = {
    id: "1000",
    title: "The Dead Zone",
    description: "An evil man becomes president and could cause a nuclear war.",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: date,
    dateModified: date,
  };

  projectRepository.add(newProject);

  const projects = projectRepository.getAll();

  expect(projects.length).toEqual(3);
});

test("can update project", () => {
  const dateModified = new Date();

  const updatedProject = {
    id: "1",
    title: "It - by S.K.",
    description: "It's really scary",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: dateForIt,
    dateModified: dateModified,
  };

  const response = projectRepository.update(updatedProject);

  expect(response).toEqual({
    id: "1",
    title: "It - by S.K.",
    description: "It's really scary",
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: dateForIt,
    dateModified: dateModified,
  });
});

test("can delete project", () => {
  projectRepository.delete("1");

  const projects = projectRepository.getAll();

  expect(projects.length).toEqual(1);
});
