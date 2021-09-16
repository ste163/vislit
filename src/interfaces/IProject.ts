export default interface IProject {
  _id: string;
  title: string;
  description: string;
  typeId: number;
  completed: boolean;
  archived: boolean;
  dateCreated: Date;
  dateModified: Date;
}
