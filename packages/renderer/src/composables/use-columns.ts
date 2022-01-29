// Handles all column events and logic
import type { Column } from "interfaces";
import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";
import type { Store } from "../store";

// SORTING IS BROKEN AFTER IMPLEMENTING COLUMN COMPONENTS
// Attempt to refactor it where it's based on column.position = index of where it is in the array
// What will happen is all sorting logic will be,
// get the item that is to the right of where I currently am
// then set that item's position to my dragging item's position
// and because it's all index-based, it should always sort correctly

type columnLayout = {
  sortedColumns: ComputedRef<Column[]>;
  isDraggingActive: ComputedRef<boolean>;
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

// Need to pass in HTMLDivElements because I need real references from template to get sizes
export default function useColumns(
  store: Store,
  leftDropZoneColumns: Ref<HTMLDivElement[]>,
  rightDropZoneColumns: Ref<HTMLDivElement[]>
): columnLayout {
  const columns = store.state.columns;

  const activeDragColumn = ref<Column>({
    header: "blank",
    isActive: true,
    dropZone: "blank",
    position: Number.NEGATIVE_INFINITY,
    width: "200px",
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

  // Main drag-drop & sort logic runs here, whenever mouse moves
  function onDropZoneDragOver(event: DragEvent, dropZone: string): void {
    if (event !== undefined) {
      event.preventDefault();

      if (event.dataTransfer !== null) {
        currentHoveredDropZone.value = dropZone;

        columns.forEach((column) => {
          if (column.header === activeDragColumnHeader.value) {
            column.dropZone = dropZone;
          }
        });

        const afterColumnIndex = getDragAfterColumnIndex(dropZone, event.x);

        updateColumnPositionsOnDrag(afterColumnIndex);
      }
    }
  }

  function onColumnDrop(event: DragEvent, dropZone: string): void {
    if (event !== undefined) {
      if (event.dataTransfer !== null) {
        const column = findActiveColumn();
        currentHoveredDropZone.value = ""; // resets value for watcher

        simplifyColumnPositionsOnDrop();

        if (column !== undefined) {
          column.dropZone = dropZone; // moves column into the correct drop zone
        }
      } else {
        console.error(DRAG_ERROR);
      }
    }
  }

  // ******
  // Helpers
  // ******
  function getColumnsInDropZone(dropZone: string): Column[] {
    return sortedColumns.value.filter((column) => column.dropZone === dropZone);
  }

  function getDragAfterColumnIndex(
    dropZone: string,
    mouseX: number
  ): number | undefined {
    let allColumnsInDropZone: Array<HTMLDivElement> = [];

    // Set currently dragged divs in state
    if (dropZone === "left") {
      allColumnsInDropZone = leftDropZoneColumns.value;
    } else {
      allColumnsInDropZone = rightDropZoneColumns.value;
    }

    const allColumnsExceptActive: Array<HTMLDivElement> =
      allColumnsInDropZone.filter((column) => {
        return (
          // If Div structure changes in ColumnContainer.vue, this needs to change
          column.children[0].children[0].children[0].innerHTML !==
          activeDragColumnHeader.value
        );
      });

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

        // If Div structure changes in ColumnContainer.vue, this needs to change
        return (columnIndex = findColumnIndexByInnerHTML(
          closestElement.children[0].children[0].children[0].innerHTML
        ));
      } else {
        columnIndex = undefined;
      }
    }

    return columnIndex;
  }

  function updateColumnPositionsOnDrag(closestIndex: number | undefined): void {
    const dropZoneColumns = getColumnsInDropZone(currentHoveredDropZone.value);

    const activeDragColumn = findActiveColumn();

    if (activeDragColumn !== undefined && dropZoneColumns.length > 0) {
      if (closestIndex !== undefined) {
        // then we are hovering to the left of a column, so begin repositioning
        sortColumnsOnDrag(activeDragColumn, closestIndex);
      } else {
        // else we're hovering to the farthest right of a drop zone
        positionColumnToFarRight(dropZoneColumns, activeDragColumn);
      }
    }
  }

  function sortColumnsOnDrag(
    activeDragColumn: Column,
    closestIndex: number
  ): void {
    const columnsInDropZone = getColumnsInDropZone(
      currentHoveredDropZone.value
    );
    const columnToRight: Column = columns[closestIndex]; // needs to be based on the full columns array to get correct column

    if (columnToRight !== undefined) {
      const farRightColumn = columnsInDropZone[columnsInDropZone.length - 1];
      activeDragColumn.position = columnToRight.position - 1;
      if (columnToRight.position < farRightColumn.position) {
        columnToRight.position = columnToRight.position + 1; // must update the columnToRight position or sorting can have too many duplicates
      }

      handleColumnSort(columnsInDropZone, columnToRight);
      handleDuplicatePositions(columnsInDropZone);
    }
  }

  function positionColumnToFarRight(
    dropZoneColumns: Column[],
    activeDragColumn: Column
  ): void {
    const farthestRightColumn = dropZoneColumns[dropZoneColumns.length - 1];

    if (
      activeDragColumn !== undefined &&
      activeDragColumn.position <
        dropZoneColumns[dropZoneColumns.length - 1].position
    ) {
      activeDragColumn.position = farthestRightColumn.position + 1;
    }
  }

  function handleColumnSort(
    columnsInDropZone: Column[],
    columnToRight: Column
  ): void {
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
  }

  function handleDuplicatePositions(columnsInDropZone: Column[]): void {
    const duplicatePosition = findDuplicateColumnPosition(columnsInDropZone);

    if (duplicatePosition !== undefined) {
      const indexOfFirstDuplicate = columnsInDropZone
        .map((column) => column.position)
        .indexOf(duplicatePosition);

      if (indexOfFirstDuplicate !== undefined) {
        for (let i = indexOfFirstDuplicate; i < columnsInDropZone.length; i++) {
          if (i === indexOfFirstDuplicate) {
            columnsInDropZone[i].position = i - 1;
          }
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
    const activeColumn = columns.find(
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
    return columns.map((column) => column.header).indexOf(innerHTML);
  }

  function simplifyColumnPositionsOnDrop(): void {
    // Because column positions increase or decrease infinitely while dragging,
    // when column drops into drop zone, simplify positions for both drop zones
    // based on the length of each drop zone array

    // Need the state and not the div references
    const leftColumns = columns.filter((column) => column.dropZone === "left");
    const rightColumns = columns.filter(
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
    const sorted = columns.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      } else if (a.position > b.position) {
        return 1;
      } else {
        return 0;
      }
    });

    return getOnlyActiveColumns(sorted);
  }

  function getOnlyActiveColumns(columns: Array<Column>): Array<Column> {
    return columns.filter((column) => column.isActive === true);
  }

  const sortedColumns = computed(() => sortColumns());
  const isDraggingActive = computed(() =>
    activeDragColumnHeader.value === "" ? false : true
  );

  return {
    sortedColumns,
    isDraggingActive,
    activeDragColumnHeader,
    getColumnsInDropZone,
    onColumnDragStart,
    onColumnDragEnd,
    onDropZoneDragOver,
    onColumnDrop,
  };
}
