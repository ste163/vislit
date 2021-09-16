export default interface IProject {
  title: string;
  description: string;
  typeId: number;
  completed: boolean;
  archived: boolean;
  dateCreated: Date;
  dateModified: Date;
}
