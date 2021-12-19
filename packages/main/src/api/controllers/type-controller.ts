import type TypeRepository from "../repositories/type-repository";
import type { Type } from "interfaces";

class TypeController {
  #typeRepository: TypeRepository;

  constructor(typeRepository: TypeRepository) {
    this.#typeRepository = typeRepository;
  }

  #checkForTypeInDb(value: string): void {
    const type = this.#typeRepository.getByValue(value);
    if (type) throw new Error("Type is already in database");
  }

  getAll(): Type[] | Error {
    try {
      return this.#typeRepository.getAll();
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  add(type: Type): Type | Error {
    try {
      this.#checkForTypeInDb(type.value);
      return this.#typeRepository.add(type);
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  delete(id: string): true | Error {
    try {
      const types = this.#typeRepository.getAll();
      const foundType = types.find((type) => type.id === id);
      if (!foundType) throw new Error("Type not in database");
      this.#typeRepository.delete(id);
      return true;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default TypeController;
