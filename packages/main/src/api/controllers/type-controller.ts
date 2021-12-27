import type TypeRepository from "../repositories/type-repository";
import type { Project, Type } from "interfaces";

class TypeController {
  #typeRepository: TypeRepository;

  constructor(typeRepository: TypeRepository) {
    this.#typeRepository = typeRepository;
  }

  #checkForTypeInDb(value: string): void {
    const type = this.#typeRepository.getByValue(value);
    if (type) throw new Error("Type is already in database");
  }

  #checkForProjectsWithTypeInDb(id: string): Project[] | void {
    const areProjectsRelatedToThisType =
      this.#typeRepository.checkForTypeTaken(id);
    if (areProjectsRelatedToThisType === undefined) return; // No projects with this type
    if (areProjectsRelatedToThisType.length > 0)
      throw new Error(
        "Type cannot be deleted as projects are connected to this type"
      );
  }

  getAll(): Type[] | Error {
    try {
      return this.#typeRepository.getAll();
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  add(value: string): Type | Error {
    try {
      this.#checkForTypeInDb(value);
      return this.#typeRepository.add(value.trim().toLowerCase());
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
      this.#checkForProjectsWithTypeInDb(id);
      this.#typeRepository.delete(id);
      return true;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default TypeController;
