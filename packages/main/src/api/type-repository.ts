import type { Project, Type } from "interfaces";
import type Database from "../database";

class TypeRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByValue(value: string): Type {
    return this.#database.db.chain.get("types").find({ value }).value();
  }

  getAll(): Type[] {
    let types = this.#database.db.data?.types;
    if (types === undefined) types = [];
    const sortedAlphabetically = types.sort((a, b) => {
      const typeA = a.value;
      const typeB = b.value;
      if (typeA < typeB) return -1;
      if (typeA > typeB) return 1;
      return 0;
    });
    return sortedAlphabetically;
  }

  add(value: string): Type {
    this.#database.db.data?.types.push(
      this.#database.generateUniqueId({ value, dateCreated: new Date() })
    );
    this.#database.db.write();
    return this.#database.db.chain.get("types").find({ value }).value();
  }

  delete(id: string): void {
    this.#database.db.chain.get("types").remove({ id }).value();
    this.#database.db.write();
  }

  checkForTypeTaken(typeId: string): Project[] | undefined {
    return this.#database.db.data?.projects.filter((project) => {
      if (project.typeId === typeId) return project;
    });
  }
}

export default TypeRepository;
