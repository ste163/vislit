import type TypeRepository from "../repositories/typeRepository";
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
}

export default TypeController;
