// Handles all column events and logic
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import Column from "@/interfaces/Column";

type columnLayout = {
  sortedColumns: ComputedRef<Column[]>;
  activeDragColumnHeader: Ref<string>;
  getColumnsInDropZone: (dropZone: string) => Column[];
  onColumnDragStart: (
    event: DragEvent,
    header: string,
    initialDropZone: string
  ) => void;
  onColumnDragEnd: () => void;
  onDropZoneDragOver: (event: DragEvent, dropZone: string) => void;
  onColumnDrop: (event: DragEvent, dropzone: string) => void;
};

// ONLY KNOWN BUG:
// If you have 4 columns
// and you try to drag the far left over the one directly to its right
// it won't allow you to, until you go over the 3rd column

// Need to pass in HTMLDivElements because I need the real references from the template
export default function useColumns(
  leftDropZoneColumns: Ref<HTMLDivElement[]>,
  rightDropZoneColumns: Ref<HTMLDivElement[]>
): columnLayout {
  const columns = ref<Array<Column>>([
    {
      header: "Settings",
      dropZone: "left",
      position: -2,
    },
    {
      header: "Projects",
      dropZone: "left",
      position: -1,
    },
    { header: "Notes", dropZone: "left", position: 0 },
    { header: "Lexicons", dropZone: "right", position: 0 },
  ]);

  const activeDragColumn = ref<Column>({
    header: "blank",
    dropZone: "blank",
    position: Number.NEGATIVE_INFINITY,
  });
  const activeDragColumnHeader = ref<string>("");
  const currentHoveredDropZone = ref<string>("");
  const initialHoveredDropZone = ref<string>("");

  const DRAG_ERROR = "Event was not a drag event.";

  // ******
  // Events
  // ******
  function onColumnDragStart(
    event: DragEvent,
    header: string,
    initialDropZone: string
  ): void {
    if (event.dataTransfer !== null) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      activeDragColumnHeader.value = header; // Assigns CSS for dragging start
      initialHoveredDropZone.value = initialDropZone;
    } else {
      console.error(DRAG_ERROR);
    }
  }

  // Removes preview styles
  function onColumnDragEnd(): void {
    activeDragColumnHeader.value = "";
  }

  // Main function containing the drag & sort logic -> runs every time mouse moves
  function onDropZoneDragOver(event: DragEvent, dropZone: string): void {
    event.preventDefault();

    if (event.dataTransfer !== null) {
      currentHoveredDropZone.value = dropZone;

      columns.value.forEach((column) => {
        if (column.header === activeDragColumnHeader.value) {
          column.dropZone = dropZone;
        }
      });

      const afterColumnIndex = getDragAfterColumnIndex(dropZone, event.x);

      dragUpdateColumnPositions(afterColumnIndex);
    }
  }

  function onColumnDrop(event: DragEvent, dropZone: string): void {
    if (event.dataTransfer !== null) {
      const column = findActiveColumn();
      currentHoveredDropZone.value = ""; // resets value for watcher

      simplifyColumnPositionsOnDrop();

      // Moves the column into the correct dropzone
      if (column !== undefined) {
        column.dropZone = dropZone;
      }
    } else {
      console.error(DRAG_ERROR);
    }
  }

  // ******
  // Helpers
  // ******
  function getColumnsInDropZone(dropZone: string): Column[] {
    return sortedColumns.value.filter((column) => column.dropZone === dropZone);
  }

  function getDragAfterColumnIndex(
    dropzone: string,
    mouseX: number
  ): number | undefined {
    let allColumnsInDropzone: Array<HTMLDivElement> = [];

    // Set currently dragged divs in state
    if (dropzone === "left") {
      allColumnsInDropzone = leftDropZoneColumns.value;
    } else {
      allColumnsInDropzone = rightDropZoneColumns.value;
    }

    const allColumnsExceptActive: Array<HTMLDivElement> =
      allColumnsInDropzone.filter(
        (column) => column.innerHTML !== activeDragColumnHeader.value
      );

    return findClosestColumnIndex(allColumnsExceptActive, mouseX);
  }

  function findClosestColumnIndex(
    columns: Array<HTMLDivElement>,
    mouseX: number
  ): number | undefined {
    let columnIndex: number | undefined;
    let closestOffset = Number.NEGATIVE_INFINITY;
    let closestElement: HTMLDivElement; // which is going to be the element that is CLOSEST to our left

    for (let i = 0; i < columns.length; i++) {
      const childElement: HTMLDivElement = columns[i];
      closestElement = childElement;

      const box: DOMRect = childElement.getBoundingClientRect();
      const cursorOffset: number = mouseX - box.left - box.width / 2;

      if (cursorOffset < 0 && cursorOffset > closestOffset) {
        closestElement = childElement;
        closestOffset = cursorOffset;
        return (columnIndex = findColumnIndexByInnerHTML(
          closestElement.innerHTML
        ));
      } else {
        columnIndex = undefined;
      }
    }

    return columnIndex;
  }

  function dragUpdateColumnPositions(closestIndex: number | undefined): void {
    const dropZoneColumns = getColumnsInDropZone(currentHoveredDropZone.value);

    const columnToReposition = findActiveColumn();

    if (columnToReposition !== undefined && dropZoneColumns.length > 0) {
      if (closestIndex !== undefined) {
        // then we are hovering to the left of a column, so begin repositioning
        sortColumnsOnDrag(columnToReposition, closestIndex);
      } else {
        // else we're hovering to the farthest right of a dropzone
        positionColumnToFarRight(dropZoneColumns, columnToReposition);
      }
    }
  }

  function sortColumnsOnDrag(
    columnToReposition: Column,
    closestIndex: number
  ): void {
    const columnsInDropZone = getColumnsInDropZone(
      currentHoveredDropZone.value
    );
    const columnToRight: Column = columns.value[closestIndex]; // needs to be based on the full columns array to get correct column
    if (columnToRight !== undefined) {
      columnToReposition.position = columnToRight.position - 1;
      columnToRight.position = columnToRight.position + 1; //  must update the columnToRight position or sorting can have too many duplicates

      const indexOfRepositionedColumn = columnsInDropZone
        .map((column) => column.header)
        .indexOf(columnToRight.header);

      const columnsToReposition = columnsInDropZone.slice(
        0,
        indexOfRepositionedColumn - 1
      );

      if (columnsToReposition.length > 0) {
        columnsToReposition.forEach((column) => {
          if (column.position >= columnsToReposition[0].position) {
            column.position = column.position - 1;
          }
        });
      }

      handleDuplicatePositions(columnsInDropZone);
    }
  }

  function positionColumnToFarRight(
    dropZoneColumns: Column[],
    columnToReposition: Column
  ): void {
    const farthestRightColumn = dropZoneColumns[dropZoneColumns.length - 1];

    if (
      columnToReposition !== undefined &&
      columnToReposition.position <
        dropZoneColumns[dropZoneColumns.length - 1].position
    ) {
      columnToReposition.position = farthestRightColumn.position + 1;
    }
  }

  function findDuplicateColumnPosition(dropZoneColumns: Array<Column>): number {
    const positions = dropZoneColumns.map((column) => column.position);

    const set = new Set(positions);

    const duplicate = positions.filter((position) => {
      if (set.has(position)) {
        set.delete(position);
      } else {
        return position;
      }
    });

    return duplicate[0];
  }

  function handleDuplicatePositions(columnsInDropZone: Column[]): void {
    const duplicatePosition = findDuplicateColumnPosition(columnsInDropZone);

    // use duplicatePosition to find first instance of column that matches that position
    // based on the computed sort order, it will be the one that needs to be modified
    if (duplicatePosition !== undefined) {
      const duplicateToShiftLeft = columnsInDropZone.find(
        (column) => column.position === duplicatePosition
      );

      if (duplicateToShiftLeft !== undefined) {
        duplicateToShiftLeft.position = duplicateToShiftLeft.position - 1;
      }
    }
  }

  function findActiveColumn(): Column | undefined {
    const activeColumn = columns.value.find(
      (column) => column.header === activeDragColumnHeader.value
    );

    if (activeColumn !== undefined) {
      activeDragColumn.value = activeColumn;
      return activeColumn;
    } else {
      return undefined;
    }
  }

  function findColumnIndexByInnerHTML(innerHTML: string): number {
    return columns.value.map((column) => column.header).indexOf(innerHTML);
  }

  function simplifyColumnPositionsOnDrop(): void {
    // Because column positions increase or decrease infinitely while dragging,
    // when column drops into drop zone, simplify positions for both drop zones
    // based on the length of each drop zone array

    // Need the state and not the div references
    const leftColumns = columns.value.filter(
      (column) => column.dropZone === "left"
    );
    const rightColumns = columns.value.filter(
      (column) => column.dropZone === "right"
    );

    // Because columns are sorted by position
    // set their new positions based on their index value
    assignPositionByIndex(leftColumns);
    assignPositionByIndex(rightColumns);
  }

  function assignPositionByIndex(columnsToReposition: Column[]): void {
    for (let i = 0; i < columnsToReposition.length; i++) {
      columnsToReposition[i].position = i;
    }
  }

  function sortColumns(): Array<Column> {
    return columns.value.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      } else if (a.position > b.position) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  const sortedColumns = computed(() => sortColumns());

  return {
    sortedColumns,
    activeDragColumnHeader,
    getColumnsInDropZone,
    onColumnDragStart,
    onColumnDragEnd,
    onDropZoneDragOver,
    onColumnDrop,
  };
}
