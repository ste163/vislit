/**
 * @jest-environment node
 */
import fs from "fs";
import FileSystemController from "./file-system-controller";
import type { htmlWriteRequest } from "../schemas";

describe("file-system-controller", () => {
  let fileSystemController: FileSystemController;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => undefined);
    jest.spyOn(fs, "rmSync").mockImplementation(() => undefined);
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => undefined);
    jest.spyOn(fs, "readFileSync").mockImplementation(() => "/file.html");
    jest
      .spyOn(fs, "readdirSync")
      .mockImplementation(() => ["file1", "file2"] as any);

    fileSystemController = new FileSystemController("/test");
  });

  it("makeProjectDirectory - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.makeProjectDirectory(3 as any as string)
    ).toBeInstanceOf(Error);
  });

  it("makeProjectDirectory - returns true with correct schema", () => {
    expect(fileSystemController.makeProjectDirectory("1")).toBe(true);
  });

  it("deleteProjectDirectory - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.deleteProjectDirectory(3 as any as string)
    ).toBeInstanceOf(Error);
  });

  it("deleteProjectDirectory - returns true with correct schema", () => {
    expect(fileSystemController.deleteProjectDirectory("1")).toBe(true);
  });

  it("writeHtmlFile - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.writeHtmlFile(3 as any as htmlWriteRequest)
    ).toBeInstanceOf(Error);
  });

  it("writeHtmlFile - returns true with correct schema", () => {
    expect(
      fileSystemController.writeHtmlFile({
        id: "1",
        html: "<p>Hello<p>",
        type: "notes",
      })
    ).toBe(true);
  });

  it("deleteNote - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.deleteNote({
        id: "1",
        projectId: 2 as any as string,
      })
    ).toBeInstanceOf(Error);
  });

  it("deleteNote - returns true with correct schema", () => {
    expect(fileSystemController.deleteNote({ id: "1", projectId: "2" })).toBe(
      true
    );
  });

  it("readNoteById - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.readNoteById({
        noteId: "1",
        projectId: 2 as any as string,
      })
    ).toBeInstanceOf(Error);
  });

  it("readNoteById - returns file with correct schema", () => {
    expect(
      fileSystemController.readNoteById({ noteId: "1", projectId: "2" })
    ).toBe("/file.html");
  });

  it("readMostRecentHtmlFile - returns error if wrong schema passed in", () => {
    expect(
      fileSystemController.readMostRecentHtmlFile({
        id: "1",
        type: 2 as any as string,
      })
    ).toBeInstanceOf(Error);
  });

  it("readMostRecentHtmlFile - returns file with correct schema", () => {
    expect(
      fileSystemController.readMostRecentHtmlFile({
        id: "1",
        type: "notes",
      })
    ).toBe("/file.html");
  });
});
