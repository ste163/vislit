/**
 * @vitest-environment node
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import FileSystemController from "./file-system-controller";
import { ZodError } from "zod";
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

  it("makeProjectDirectory - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.makeProjectDirectory(3 as any as string)
    ).toBeInstanceOf(ZodError);
  });

  it("makeProjectDirectory - returns true with correct schema", async () => {
    expect(await fileSystemController.makeProjectDirectory("1")).toBe(true);
  });

  it("deleteProjectDirectory - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.deleteProjectDirectory(3 as any as string)
    ).toBeInstanceOf(ZodError);
  });

  it("deleteProjectDirectory - returns true with correct schema", async () => {
    expect(await fileSystemController.deleteProjectDirectory("1")).toBe(true);
  });

  it("writeHtmlFile - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.writeHtmlFile(3 as any as htmlWriteRequest)
    ).toBeInstanceOf(ZodError);
  });

  it("writeHtmlFile - returns true with correct schema", async () => {
    expect(
      await fileSystemController.writeHtmlFile({
        id: "1",
        html: "<p>Hello<p>",
        type: "notes",
      })
    ).toBe(true);
  });

  it("deleteNote - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.deleteNote({
        id: "1",
        projectId: 2 as any as string,
      })
    ).toBeInstanceOf(ZodError);
  });

  it("deleteNote - returns true with correct schema", async () => {
    expect(
      await fileSystemController.deleteNote({ id: "1", projectId: "2" })
    ).toBe(true);
  });

  it("readNoteById - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.readNoteById({
        noteId: "1",
        projectId: 2 as any as string,
      })
    ).toBeInstanceOf(ZodError);
  });

  it("readNoteById - returns file with correct schema", async () => {
    expect(
      await fileSystemController.readNoteById({ noteId: "1", projectId: "2" })
    ).toBe("/file.html");
  });

  it("readMostRecentHtmlFile - returns error if wrong schema passed in", async () => {
    expect(
      await fileSystemController.readMostRecentHtmlFile(2 as any as string)
    ).toBeInstanceOf(ZodError);
  });

  it("readMostRecentHtmlFile - returns file with correct schema", async () => {
    expect(await fileSystemController.readMostRecentHtmlFile("1")).toBe(
      "/file.html"
    );
  });
});
