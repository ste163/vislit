/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import { ZodError } from "zod";
import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import type { searchRequest } from "../schemas";

// Only testing endpoints that frontend has access to
// TODO: Tests with successful schema
describe("file-system-controller", () => {
  let searchController: SearchController;

  beforeEach(async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { app } = await vi.importMock("electron");
    const initDb = await initializeDatabase(app);
    const database = new Database(initDb);
    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(database);
    searchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );
  });

  it("searchProject - returns error if wrong schema passed in", () => {
    expect(
      searchController.searchProjects({ query: "test" } as any as searchRequest)
    ).toBeInstanceOf(ZodError);
  });

  it("searchNotes - returns error if wrong schema passed in", () => {
    expect(
      searchController.searchNotes({ query: "test" } as any as searchRequest)
    ).toBeInstanceOf(ZodError);
  });
});
