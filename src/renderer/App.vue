/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <!-- TODO -->
  <!-- Move all column logic & saving into a custom hook(s) -->
  <!-- Style Template Columns that use Slots -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be resizable -->
  <!-- DONE - Allow columns to be dragged and dropped -->
  <!-- Allow columns to be ordered in their dropzone -->
  <!-- Only show drop-zones when the user is dragging a column -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <the-sidebar />

  <!-- Left drop-able area -->
  <div
    class="column-dropzone"
    @drop="onColumnDrop($event, 'left')"
    @dragover="onDropzoneDragOver($event, 'left')"
    @dragenter.prevent
  >
    <div
      v-for="(column, i) in getColumnsInDropzone('left')"
      :ref="
        (el) => {
          if (el) this.leftColumnDivs[i] = el;
        }
      "
      :key="column.header"
      class="column-draggable"
      :class="
        activeDragColumnHeader === column.header ? 'column-drag-active' : ''
      "
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header, 'left')"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </div>

  <main class="dashboard">
    <router-view />
  </main>

  <!-- Right drop-able area -->
  <div
    class="column-dropzone"
    @drop="onColumnDrop($event, 'right')"
    @dragover="onDropzoneDragOver($event, 'right')"
    @dragenter.prevent
  >
    <div
      v-for="(column, i) in getColumnsInDropzone('right')"
      :ref="
        (el) => {
          if (el) this.rightColumnDivs[i] = el;
        }
      "
      :key="column.header"
      class="column-draggable"
      :class="
        activeDragColumnHeader === column.header ? 'column-drag-active' : ''
      "
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header, 'right')"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUpdate, ref, watch } from "vue";
import TheSidebar from "./components/TheSidebar.vue";
import Column from "@/interfaces/Column";

export default defineComponent({
  components: { TheSidebar },

  setup() {
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

    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const activeDragColumn = ref<Column>({
      header: "blank",
      dropZone: "blank",
      position: Number.NEGATIVE_INFINITY,
    });
    const activeDragColumnHeader = ref<string>("");
    const currentHoveredDropzone = ref<string>("");
    const initialHoveredDropZone = ref<string>("");
    const columnPositions = ref<Array<number>>([]);

    const DRAG_ERROR = "Event was not a drag event.";

    function getColumnsInDropzone(dropZone: string) {
      return sortedColumns.value.filter(
        (column) => column.dropZone === dropZone
      );
    }

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

    function onColumnDragEnd(): void {
      // Remove preview styles
      activeDragColumnHeader.value = "";
    }

    // Main function containing the drag & sort logic
    function onDropzoneDragOver(event: DragEvent, dropzone: string): void {
      event.preventDefault();

      if (event.dataTransfer !== null) {
        currentHoveredDropzone.value = dropzone;

        columns.value.forEach((column) => {
          if (column.header === activeDragColumnHeader.value) {
            column.dropZone = dropzone;
          }
        });

        const afterColumnIndex = getDragAfterColumnIndex(dropzone, event.x);

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

    function getDragAfterColumnIndex(
      dropzone: string,
      mouseX: number
    ): number | undefined {
      let allColumnsInDropzone: Array<HTMLDivElement> = [];

      // Set currently dragged divs in state
      if (dropzone === "left") {
        allColumnsInDropzone = leftColumnDivs.value;
      } else {
        allColumnsInDropzone = rightColumnDivs.value;
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
      // Bug right now is that there is the possibility for a position number in one dropzone
      // to equal that of another
      // so what I need to do, is set the position, when the user swaps dropzones
      // to 1 less than the lowest position in that dropzone

      const dropZoneColumns = getColumnsInDropzone(
        currentHoveredDropzone.value
      );

      const columnToReposition = findActiveColumn();

      if (columnToReposition !== undefined && dropZoneColumns.length > 0) {
        if (closestIndex !== undefined) {
          // then we are hovering to the left of a column, so begin repositioning
          const columnsInDropZone = getColumnsInDropzone(
            currentHoveredDropzone.value
          );
          // console.log("INCOMING INDEX", closestIndex);
          const columnToRight: Column = columns.value[closestIndex];
          if (columnToRight !== undefined) {
            // We know where the columnToRight is, and we can always get there
            // So what if we just lower everything to the left of that by 1
            columnToReposition.position = columnToRight.position - 1;
            columnToRight.position = columnToRight.position + 1;

            console.log(
              "column to right, to modify based off of",
              columnToRight
            );
            const indexOfRepositionedColumn = columnsInDropZone
              .map((column) => column.header)
              .indexOf(columnToRight.header);

            const repositionColumns = columnsInDropZone.slice(
              0,
              indexOfRepositionedColumn - 1
            );

            if (repositionColumns.length > 0) {
              repositionColumns.forEach(
                (column) => (column.position = column.position - 1)
              );
            }

            console.log(repositionColumns);

            // If we do it the above way, it removes the chance of duplication!!!

            const duplicatePosition =
              findDuplicateColumnPosition(columnsInDropZone);

            // use this duplicatePosition to find the first instance of a column that matches that position
            // based on the order, it will be the one that needs to be modified
            if (duplicatePosition !== undefined) {
              const duplicateToShiftLeft = columnsInDropZone.find(
                (column) => column.position === duplicatePosition
              );

              if (duplicateToShiftLeft !== undefined) {
                duplicateToShiftLeft.position =
                  duplicateToShiftLeft.position - 1;
              }
            }
          }
        } else {
          // else we're hovering to the farthest right of a dropzone
          const farthestRightColumn =
            dropZoneColumns[dropZoneColumns.length - 1];

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

    function findDuplicateColumnPosition(
      dropZoneColumns: Array<Column>
    ): number {
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

    // ATTEMPT TO DELETE THIS
    // If the array test works
    function setColumnPositionsForDropZone(): void {
      const columnsInDropZone = getColumnsInDropzone(
        currentHoveredDropzone.value
      );

      columnPositions.value = columnsInDropZone.map(
        (column) => column.position
      );
    }

    // ATTEMPT TO DELETE THIS
    // If the array test works
    function removeDuplicatePositionsOnDrag(): void {
      const columnsInDropZone = getColumnsInDropzone(
        currentHoveredDropzone.value
      );

      const duplicatePosition = findDuplicateColumnPosition(columnsInDropZone);
      // console.log("DUPLICATE POSITION", duplicatePosition);
      if (duplicatePosition !== undefined) {
        // console.log("remove duplicatePosition", duplicatePosition);

        const duplicateToShiftLeft = columnsInDropZone.find(
          (column) => column.position === duplicatePosition
        );

        if (duplicateToShiftLeft !== undefined) {
          duplicateToShiftLeft.position = duplicateToShiftLeft.position - 1;
        }

        setColumnPositionsForDropZone();
      }
    }

    // ATTEMPT TO DELETE THIS
    // If the array test works
    function resetPositionOnDropZoneChange() {
      // need to store the initialHoveredDropZone
      if (currentHoveredDropzone.value !== "") {
        if (currentHoveredDropzone.value !== initialHoveredDropZone.value) {
          initialHoveredDropZone.value = currentHoveredDropzone.value;
          if (currentHoveredDropzone.value === "right") {
            const columnsInDropZone = getColumnsInDropzone("right");
            if (columnsInDropZone.length === 1) {
              activeDragColumn.value.position = 0;
            } else {
              activeDragColumn.value.position =
                columnsInDropZone[0].position - 1;
            }
          } else {
            const columnsInDropZone = getColumnsInDropzone("left");
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

    // THESE 3 WATCHES MIGHT NOT BE NEEDED!!!
    // Add the dropzone change fix
    // and then see if that fixes it
    // Need to watch the position and dropZone change for the activeDragColumn so it's in real-time
    watch(() => activeDragColumn.value.position, setColumnPositionsForDropZone);
    watch(() => activeDragColumn.value.dropZone, setColumnPositionsForDropZone);
    watch(() => columnPositions.value, removeDuplicatePositionsOnDrag);
    // Watch for when the dropzone changes
    // if it's left, set to max position +1
    // if it's right, min position -1. This way we can fix duplicates on dropZone change, which might be why we have dupes
    watch(() => currentHoveredDropzone.value, resetPositionOnDropZoneChange);

    // *****
    // ALL CODE ABOVE SHOULD ATTEMPTED TO BE MOVED INTO A composable? hook? --- lookup wording
    // ******

    // ALL CODE BELOW NEEDS TO STAY IN THIS FUNCTION
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

    // Needed to reset references based on docs
    onBeforeUpdate(() => {
      leftColumnDivs.value = [];
      rightColumnDivs.value = [];
    });

    return {
      sortedColumns,
      getColumnsInDropzone,
      onColumnDragStart,
      onDropzoneDragOver,
      onColumnDragEnd,
      onColumnDrop,
      activeDragColumnHeader,
      leftColumnDivs,
      rightColumnDivs,
    };
  },
});
</script>

<style>
#app {
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
}

.dashboard {
  flex-grow: 1;
}

.column-dropzone {
  display: flex;
  flex-flow: row nowrap;
  padding: 1em;
  background-color: rgb(138, 138, 138);
  min-width: 0.5em;
}

.column-draggable {
  background-color: white;
  border-left: 2px black solid;
  width: 6em;
  cursor: move;
}

.column-drag-active {
  opacity: 0.5;
}
</style>
