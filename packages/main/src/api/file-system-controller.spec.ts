/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import FileSystemController from "./file-system-controller";
import type { htmlWriteRequest } from "../schemas";

describe("file-system-controller", () => {
  let fileSystemController: FileSystemController;

  beforeEach(() => {
    vi.mock("fs/promises", () => {
      return {
        mkdir: vi.fn(),
        rm: vi.fn(),
        writeFile: vi.fn(),
        readFile: vi.fn(() => "/file.html"),
        readdir: vi.fn(() => ["file1", "file2"]),
      };
    });

    vi.spyOn(console, "error").mockImplementation(() => {});

    fileSystemController = new FileSystemController("");
  });

  it("makeProjectDirectory - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.makeProjectDirectory(3 as any as string)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("makeProjectDirectory - returns true with correct schema", async () => {
    expect(await fileSystemController.makeProjectDirectory("1")).toEqual(true);
  });

  it("deleteProjectDirectory - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.deleteProjectDirectory(3 as any as string)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("deleteProjectDirectory - returns true with correct schema", async () => {
    expect(await fileSystemController.deleteProjectDirectory("1")).toEqual(
      true
    );
  });

  it("writeHtmlFile - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.writeHtmlFile(3 as any as htmlWriteRequest)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("writeHtmlFile - returns true with correct schema", async () => {
    expect(
      await fileSystemController.writeHtmlFile({
        id: "1",
        html: "<p>Hello<p>",
        type: "notes",
      })
    ).toEqual(true);
  });

  it("deleteNote - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.deleteNote({
        id: "1",
        projectId: 2 as any as string,
      })
    ).toEqual(new Error("Request does not match schema"));
  });

  it("deleteNote - returns true with correct schema", async () => {
    expect(
      await fileSystemController.deleteNote({ id: "1", projectId: "2" })
    ).toEqual(true);
  });

  it("readNoteById - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.readNoteById({
        noteId: "1",
        projectId: 2 as any as string,
      })
    ).toEqual(new Error("Request does not match schema"));
  });

  it("readNoteById - returns file with correct schema", async () => {
    expect(
      await fileSystemController.readNoteById({ noteId: "1", projectId: "2" })
    ).toEqual("/file.html");
  });

  it("readMostRecentHtmlFile - returns error if wrong schema", async () => {
    expect(
      await fileSystemController.readMostRecentHtmlFile(2 as any as string)
    ).toEqual(new Error("Request does not match schema"));
  });

  it("readMostRecentHtmlFile - returns file with correct schema", async () => {
    expect(await fileSystemController.readMostRecentHtmlFile("1")).toEqual(
      "/file.html"
    );
  });
});
