import type TypeRepository from "./type-repository";
import type { Project, Type } from "interfaces";
import type { idRequest, typeAddRequest } from "../schemas";
import { typeAddRequestSchema, idRequestSchema } from "../schemas";

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

  async add(value: typeAddRequest): Promise<Type | Error> {
    try {
      typeAddRequestSchema.parse(value);
      this.#checkForTypeInDb(value);
      return await this.#typeRepository.add(value.trim().toLowerCase());
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }

  async delete(id: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(id);
      const types = this.#typeRepository.getAll();
      const foundType = types.find((type) => type.id === id);
      if (!foundType) throw new Error("Type not in database");
      this.#checkForProjectsWithTypeInDb(id);
      await this.#typeRepository.delete(id);
      return true;
    } catch (e: any | Error) {
      console.error(e);
      return e;
    }
  }
}

export default TypeController;
