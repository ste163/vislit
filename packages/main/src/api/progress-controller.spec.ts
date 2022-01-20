/**
 * @jest-environment node
 */
import type { Project, Goal } from "interfaces";
import type Database from "../database";

describe("progress-controller-integration", () => {
  let seedProjects: Project[];
  let seedGoals: Goal[];
  let database: Database;

  // getByDate - error if no project exists
  // getByDate - return undefined if no date found
  // getByDate - return progress if date found

  // getAll - error if no project exists
  // getAll - returns empty array if no dates found
  // getAll - returns dates by year and month if found

  // modify - error if no project exists
  // modify - error if no goal exists
  // modify - success - if no date in db, add
  // modify - success - if date already in db, update
  // modify - success - if date is already in db, but all information has been removed, delete from db
});
