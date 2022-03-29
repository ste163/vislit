/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Database, initializeDatabase } from "../database";
import { SearchController, initializeSearchIndexes } from "./search-controller";
import type { searchRequest } from "./request-schemas";
import type DataPath from "../data-path";

// Only testing endpoints that frontend has access to
describe("file-system-controller", () => {
  let searchController: SearchController;

  beforeEach(async () => {
    const mockDataPath = {
      get: vi.fn(() => ""),
    } as any as DataPath;

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const initDb = await initializeDatabase(mockDataPath);
    const database = new Database(initDb, mockDataPath);
    const { projectSearchIndex, noteSearchIndex } =
      await initializeSearchIndexes(database);
    searchController = new SearchController(
      projectSearchIndex,
      noteSearchIndex
    );
  });

  it("searchProject - returns error if wrong schema", () => {
    expect(
      searchController.searchProjects({ query: "test" } as any as searchRequest)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("searchProject - calls search with correct schema", () => {
    expect(searchController.searchProjects("test")).toEqual([]);
  });

  it("searchNotes - returns error if wrong schema", () => {
    expect(
      searchController.searchNotes({ query: "test" } as any as searchRequest)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("searchNotes - calls search with correct schema", () => {
    expect(searchController.searchNotes("test")).toEqual([]);
  });
});
