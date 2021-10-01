// Should probably move to some other declare to file in the backend
export interface IColumn {
  header: string;
  isActive: boolean;
  dropZone: string;
  position: number;
  width: string; // in px; ie '150px'
}
