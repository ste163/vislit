declare module "interfaces" {
  interface ColumnModel {
    header: string;
    isActive: boolean;
    dropZone: string;
    position: number;
    width: string; // in px; ie '150px'
  }

  interface ProjectModel {
    id: string;
    title: string;
    description: string;
    typeId: number;
    completed: boolean;
    archived: boolean;
    dateCreated: Date | null;
    dateModified: Date | null;
  }

  interface DropZoneModel {
    name: string;
    maxWidth: string; // in px; ie: '150px' - limits width of columns
    currentWidth: string; // computed property of all the currently active column widths
  }
}
