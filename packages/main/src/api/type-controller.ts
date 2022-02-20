import type TypeRepository from "./type-repository";
import type { Project, Type } from "interfaces";
import type { idRequest, typeAddRequest } from "../schemas";
import { typeAddRequestSchema, idRequestSchema } from "../schemas";
import handleError from "./util-handle-error";

class TypeController {
  constructor(private typeRepository: TypeRepository) {}

  #checkForTypeInDb(value: string): void {
    const type = this.typeRepository.getByValue(value);
    if (type) throw new Error("Type is already in database");
  }

  #checkForProjectsWithTypeInDb(id: string): Project[] | void {
    const areProjectsRelatedToThisType =
      this.typeRepository.checkForTypeTaken(id);
    if (areProjectsRelatedToThisType === undefined) return; // No projects with this type
    if (areProjectsRelatedToThisType.length > 0)
      throw new Error(
        "Type cannot be deleted as projects are connected to this type"
      );
  }

  getAll(): Type[] | Error {
    try {
      return this.typeRepository.getAll();
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async add(value: typeAddRequest): Promise<Type | Error> {
    try {
      typeAddRequestSchema.parse(value);
      this.#checkForTypeInDb(value);
      return await this.typeRepository.add(value.trim().toLowerCase());
    } catch (error: any | Error) {
      return handleError(error);
    }
  }

  async delete(id: idRequest): Promise<true | Error> {
    try {
      idRequestSchema.parse(id);
      const types = this.typeRepository.getAll();
      const foundType = types.find((type) => type.id === id);
      if (!foundType) throw new Error("Type not in database");
      this.#checkForProjectsWithTypeInDb(id);
      await this.typeRepository.delete(id);
      return true;
    } catch (error: any | Error) {
      return handleError(error);
    }
  }
}

export default TypeController;
