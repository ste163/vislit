import type { IProject } from "interfaces";

export default interface IVislitDatabase {
  dbType: string;
  projects: Array<IProject>;
  types: Array<unknown>;
  progress: Array<unknown>;
  notes: Array<unknown>;
  projectLexicon: Array<unknown>;
  lexicon: Array<unknown>;
  words: Array<unknown>;
// eslint-disable-next-line semi
}
