declare module "interfaces" {
  interface Project {
    id?: string;
    title: string;
    description: string;
    typeId: string;
    type?: Type;
    goals?: Goal[];
    completed: boolean;
    archived: boolean;
    dateCreated: Date | string | null; // TODO: Make optional instead of null
    dateModified: Date | string | null; // TODO: Make optional instead of null
  }

  interface Type {
    id?: string;
    value: string;
    dateCreated?: Date | string;
  }

  interface Goal {
    id?: string;
    projectId: string;
    wordCount: number;
    isDaily: boolean;
    daysPerMonth: number | null;
    proofreadCountsTowardGoal: boolean;
    editCountsTowardGoal: boolean;
    revisedCountsTowardsGoal: boolean;
    active: boolean; // only one goal can be active at a time
    completed: boolean;
    dateCreated?: Date | string;
    dateModified?: Date | string;
  }

  interface Progress {
    date: string; // validation ensures its in ISOstring format
    projectId: string;
    goalId: string;
    count: number;
    edited: boolean;
    proofread: boolean;
    revised: boolean;
    completed?: boolean; // dynamically checked against the goal instead of saved into db on get requests
  }

  interface Note {
    id?: string;
    projectId: string;
    title: string;
    html?: string | null | undefined; // getById returns note content
    dateCreated?: Date | string;
    dateModified?: Date | string;
  }

  // Potentially move out of interfaces because only Renderer process needs to know about these
  interface DropZone {
    name: string;
    maxWidth: string; // in px; ie: '150px' - limits width of columns
    currentWidth: string; // computed property of all the currently active column widths
  }

  interface Column {
    header: string;
    isActive: boolean;
    dropZone: string;
    position: number;
    width: string; // in px; ie '150px'
  }
}
