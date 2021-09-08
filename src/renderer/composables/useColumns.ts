// Handles all column events and logic
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import Column from "@/interfaces/Column";

type columnLayout = {
  sortedColumns: ComputedRef<Column[]>;
  onColumnDragStart: (
    event: DragEvent,
    header: string,
    initialDropZone: string
  ) => void;
  onColumnDragEnd: () => void;
  onDropZoneDragOver: (event: DragEvent, dropZone: string) => void;
  onColumnDrop: (event: DragEvent, dropzone: string) => void;
  activeDragColumnHeader: Ref<string>;
  getColumnsInDropZone: (dropZone: string) => Column[];
};

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
  const currentHoveredDropzone = ref<string>("");
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

  // Main function containing the drag & sort logic
  function onDropZoneDragOver(event: DragEvent, dropZone: string): void {
    event.preventDefault();

    if (event.dataTransfer !== null) {
      currentHoveredDropzone.value = dropZone;

      columns.value.forEach((column) => {
        if (column.header === activeDragColumnHeader.value) {
          column.dropZone = dropZone;
        }
      });

      const afterColumnIndex = getDragAfterColumnIndex(dropZone, event.x);

      dragUpdateColumnPositions(afterColumnIndex);
    }
  }

  function onColumnDrop(event: DragEvent, dropzone: string): void {
    if (event.dataTransfer !== null) {
      const column = findActiveColumn();
      currentHoveredDropzone.value = ""; // resets value for watcher
      // Moves the column into the correct dropzone
      if (column !== undefined) {
        column.dropZone = dropzone;
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
    const dropZoneColumns = getColumnsInDropZone(currentHoveredDropzone.value);

    const columnToReposition = findActiveColumn();

    if (columnToReposition !== undefined && dropZoneColumns.length > 0) {
      if (closestIndex !== undefined) {
        // then we are hovering to the left of a column, so begin repositioning
        const columnsInDropZone = getColumnsInDropZone(
          currentHoveredDropzone.value
        );
        const columnToRight: Column = columns.value[closestIndex]; // needs to be based on the full columns array to get correct column
        if (columnToRight !== undefined) {
          // BUG/PERFORMANCE ISSUE
          // The positions increase or decrease continuously while dragging
          // They should instead be capped otherwise they go on infinitely
          // however, when I've tried to cap them, there's not enough "buffer" room
          // to allow for all the numbers to reposition themselves
          // POTENTIAL FIX:
          // Once the user drops a column in a dropzone
          // I can go through the columns in that dropZone
          // and re-assign their positions so that -1293, -1103, 463, 2231 becomes -2, -1, 0, 1
          // This would probably be the best fix as it allows for all the sorting to happen
          // but it doesn't get "locked in" until the drop
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
              if (column.position > columnsToReposition[0].position) {
                column.position = column.position - 1;
              }
            });
          }

          // THIS DUPE CHECK IS NEEDED,
          // Move into its own function and call it here
          const duplicatePosition =
            findDuplicateColumnPosition(columnsInDropZone);

          // use this duplicatePosition to find the first instance of a column that matches that position
          // based on the order, it will be the one that needs to be modified
          if (duplicatePosition !== undefined) {
            const duplicateToShiftLeft = columnsInDropZone.find(
              (column) => column.position === duplicatePosition
            );

            if (duplicateToShiftLeft !== undefined) {
              duplicateToShiftLeft.position = duplicateToShiftLeft.position - 1;
            }
          }
        }
      } else {
        // else we're hovering to the farthest right of a dropzone
        const farthestRightColumn = dropZoneColumns[dropZoneColumns.length - 1];

        if (
          columnToReposition !== undefined &&
          columnToReposition.position <
            dropZoneColumns[dropZoneColumns.length - 1].position
        ) {
          columnToReposition.position = farthestRightColumn.position + 1;
        }
      }
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

  // This might not actually be needed
  function resetPositionOnDropZoneChange() {
    // need to store the initialHoveredDropZone
    if (currentHoveredDropzone.value !== "") {
      if (currentHoveredDropzone.value !== initialHoveredDropZone.value) {
        initialHoveredDropZone.value = currentHoveredDropzone.value;
        if (currentHoveredDropzone.value === "right") {
          const columnsInDropZone = getColumnsInDropZone("right");
          if (columnsInDropZone.length === 1) {
            activeDragColumn.value.position = 0;
          } else {
            activeDragColumn.value.position = columnsInDropZone[0].position - 1;
          }
        } else {
          const columnsInDropZone = getColumnsInDropZone("left");
          if (columnsInDropZone.length === 1) {
            activeDragColumn.value.position = 0;
          } else {
            console.log(columnsInDropZone[columnsInDropZone.length - 1]);
            activeDragColumn.value.position =
              columnsInDropZone[columnsInDropZone.length - 1].position + 1;
          }
        }
      }
    }
  }

  // May be able to delete this
  watch(() => currentHoveredDropzone.value, resetPositionOnDropZoneChange);

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
    getColumnsInDropZone,
    onColumnDragStart,
    onColumnDragEnd,
    onDropZoneDragOver,
    onColumnDrop,
    activeDragColumnHeader,
  };
}
