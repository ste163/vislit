import type { Project, Type } from "interfaces";
import type { Database } from "../database";

class TypeRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getByValue(value: string): Type | undefined {
    return this.#database.db.data?.types.find((type) => type.value === value);
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

  async add(value: string): Promise<Type> {
    this.#database.db.data?.types.push(
      this.#database.generateUniqueId({ value, dateCreated: new Date() })
    );
    await this.#database.db.write();
    return this.getByValue(value) as Type;
  }

  async delete(id: string): Promise<void> {
    const filteredTypes = this.#database.db.data?.types.filter(
      (type) => type.id !== id
    ) as Type[];
    this.#database.db.data!.types = filteredTypes;
    await this.#database.db.write();
  }

  checkForTypeTaken(typeId: string): Project[] | undefined {
    return this.#database.db.data?.projects.filter((project) => {
      if (project.typeId === typeId) return project;
    });
  }
}

export default TypeRepository;
