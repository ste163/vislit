import type { Project } from "interfaces";

export type NotificationItem = {
  id: string;
  type: "success" | "error";
  message: string | null;
};

// emits
export interface ProjectFormSubmission {
  errorMessage?: string;
  isEditing?: boolean;
  project?: Project;
}
