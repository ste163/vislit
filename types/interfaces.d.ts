declare module "interfaces" {
  interface IColumn {
    header: string;
    isActive: boolean;
    dropZone: string;
    position: number;
    width: string; // in px; ie '150px'
  }
  
  interface IProject {
    id: string;
    title: string;
    description: string;
    typeId: number;
    completed: boolean;
    archived: boolean;
    dateCreated: Date | null;
    dateModified: Date | null;
  }
  
  
  interface IDropZone {
    name: string;
    maxWidth: string; // in px; ie: '150px' - limits width of columns
    currentWidth: string; // computed property of all the currently active column widths
  }
}