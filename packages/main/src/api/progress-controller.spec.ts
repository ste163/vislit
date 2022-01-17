/**
 * @jest-environment node
 */

import type { Project, Goal } from "interfaces";
import type Database from "../database";

describe("progress-controller-integration", () => {
  let seedProjects: Project[];
  let seedGoals: Goal[];
  let database: Database;

  // adding - error if no project exists
  // adding - error if no goal exists
  // adding - success - if no date in db, add
  // adding - success - if date already in db, update

  // delete - error if no project exists
  // delete - error if no goal exists
  // delete - error if no date exists
  // delete - success
});
