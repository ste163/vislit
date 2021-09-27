import IProject from "@/interfaces/IProject";

export default interface IDatabase {
  dbType: string;
  projects: Array<IProject>;
  types: Array<unknown>;
  progress: Array<unknown>;
  notes: Array<unknown>;
  projectLexicon: Array<unknown>;
  lexicon: Array<unknown>;
  words: Array<unknown>;
}
