/**
 * @jest-environment node
 */
import type { App } from "electron";
import Database from "../database";
import TypeRepository from "./typeRepository";

describe("type-repository", () => {
  let typeRepository: TypeRepository;

  beforeEach(() => {
    const app = null;
    const database = new Database(app as unknown as App);
    typeRepository = new TypeRepository(database);
    database.db.data!.types = [
      {
        id: "1",
        value: "novel",
      },
      {
        id: "2",
        value: "novella",
      },
      {
        id: "3",
        value: "memoir",
      },
      {
        id: "4",
        value: "short story",
      },
      {
        id: "5",
        value: "short story collection",
      },
      {
        id: "6",
        value: "poem",
      },
      {
        id: "7",
        value: "poetry collection",
      },
    ];
  });

  it("returns all types sorted alphabetically", () => {
    const types = typeRepository.getAll();
    expect(types).toEqual([
      { id: "3", value: "memoir" },
      { id: "1", value: "novel" },
      { id: "2", value: "novella" },
      { id: "6", value: "poem" },
      {
        id: "7",
        value: "poetry collection",
      },
      {
        id: "4",
        value: "short story",
      },
      {
        id: "5",
        value: "short story collection",
      },
    ]);
  });

  it("returns undefined if type is not in database", () => {
    expect(typeRepository.getByValue('non-fiction')).toEqual(undefined);
  });

  it("returns type if it's in database", () => {
    expect(typeRepository.getByValue('short story')).toEqual({
      id: "4",
      value: "short story",
    });
  });

  it("returns added type when successfully added", () => {
    const originalTypeCount = typeRepository.getAll().length;
    const addedType = typeRepository.add({ value: "non-fiction" });
    const newTypeCount = typeRepository.getAll().length;
    expect(addedType).toHaveProperty("id");
    expect(addedType.value).toEqual("non-fiction");
    expect(newTypeCount).toEqual(originalTypeCount + 1);
  });

  it("deletes type from database", () => {
    const originalTypeCount = typeRepository.getAll().length;
    typeRepository.delete("1");
    const newTypeCount = typeRepository.getAll().length;
    expect(newTypeCount).toEqual(originalTypeCount - 1);
  });
});
