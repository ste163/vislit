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
    dateCreated: Date | null;
    dateModified: Date | null;
  }

  interface Type {
    id?: string;
    value: string;
  }

  interface Goal {
    id?: string;
    projectId: string;
    basedOnWordCountOrPageCount: "word" | "page";
    frequencyToRepeat: "daily" | "weekly" | "monthly";
    daysPerFrequency?: number; // might be best to only do daysPerFrequency?
    // however, the daily weekly or monthly is easier to sort by -- weeks start on Monday
    proofreadCountsTowardGoal: boolean;
    editCountsTowardGoal: boolean;
    revisedCountsTowardsGoal: boolean;
    active?: boolean; // only one goal can be active at a time
    completed?: boolean;
    dateCreated?: Date;
    dateModified?: Date;
  }

  // Potentially move out of interfaces because API may never need to know about these
  // their info will live in localStorage
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
