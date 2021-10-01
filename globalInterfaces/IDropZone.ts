export interface IColumn {
  name: string;
  maxWidth: string; // in px; ie: '150px' - limits width of columns
  currentWidth: string; // computed property of all the currently active column widths
}
