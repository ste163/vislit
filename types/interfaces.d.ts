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
    basedOnWordCountOrPageCount: "word" | "page";
    wordOrPageCount: number;
    frequencyToRepeat: "daily" | "weekly" | "monthly";
    daysPerFrequency?: number;
    proofreadCountsTowardGoal: boolean;
    editCountsTowardGoal: boolean;
    revisedCountsTowardsGoal: boolean;
    active?: boolean; // only one goal can be active at a time
    completed?: boolean;
    dateCreated?: Date | string;
    dateModified?: Date | string;
  }

  interface Progress {
    date: string; // always use .toISOString() otherwise backend can't process between Date and string
    projectId: string;
    goalId: string;
    count: number;
    edited: boolean;
    proofread: boolean;
    revised: boolean;
    completed?: boolean; // this should be dynamically checked against the goal instead of saved into db on Get, otherwise it could become outdated
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
