import type { Type } from "interfaces";
import type Database from "../database";

class TypeRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByValue(value: string): Type {
    return this.#database.db.chain.get("types").find({value}).value();
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

  add(type: Type): Type {
    this.#database.db.data?.types.push(this.#database.generateUniqueId(type));
    this.#database.db.write();
    return this.#database.db.chain
      .get("types")
      .find({ value: type.value })
      .value();
  }

  delete(id: string): void {
    this.#database.db.chain.get("types").remove({ id }).value();
    this.#database.db.write();
  }
}

export default TypeRepository;
