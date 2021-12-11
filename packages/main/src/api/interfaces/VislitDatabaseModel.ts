import type { ProjectModel } from "interfaces";

interface VislitDatabaseModel {
  dbType: string;
  projects: Array<ProjectModel>;
  types: Array<unknown>;
  progress: Array<unknown>;
  notes: Array<unknown>;
  projectLexicon: Array<unknown>;
  lexicon: Array<unknown>;
  words: Array<unknown>;
}

export default VislitDatabaseModel;
