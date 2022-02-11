/**
 * @jest-environment node
 */
import { ZodError } from "zod";
import Database from "../database";
import SearchController from "./search-controller";
import type { searchRequest } from "../schemas";

// Only testing endpoints that frontend has access to
describe("file-system-controller", () => {
  let searchController: SearchController;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { app } = jest.requireMock("electron");
    const database = new Database(app);
    searchController = new SearchController(database);
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
