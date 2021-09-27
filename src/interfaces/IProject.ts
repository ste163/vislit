export default interface IProject {
  id: string;
  title: string;
  description: string;
  typeId: number;
  completed: boolean;
  archived: boolean;
  dateCreated: Date | null;
  dateModified: Date | null;
}
