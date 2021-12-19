import type { Type } from 'interfaces';
import type Database from '../database';

class TypeRepository {
  #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  getAll(): Type[] {
    // store all types as lowercase
    let types = this.#database.db.data?.types;
    if (types === undefined) types = [];
    const sortedAlphabetically = types.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      if (typeA < typeB) return -1;
      if (typeA > typeB) return 1;
      return 0;
    });

    // then convert to having just the first letter capitalized
    // str.charAt(0).toUpperCase()
    return sortedAlphabetically;
  } 

  add(type: Type): Type {
    // check if a type by that name is in db
    // if it is, throw error
    // else, add type then return the added Type
    this.#database.db.data?.types.push(this.#database.generateUniqueId(type));
    this.#database.db.write();
    return this.#database.db.chain.get("types").find({ type: type.type }).value();
  }
}

export default TypeRepository;