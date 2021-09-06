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
      :class="activeDragColumn === column.header ? 'column-drag-active' : ''"
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header)"
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
      :class="activeDragColumn === column.header ? 'column-drag-active' : ''"
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header)"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUpdate, ref } from "vue";
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
        dropZone: "right",
        position: -1,
      },
      { header: "Notes", dropZone: "left", position: 1 },
      { header: "Lexicons", dropZone: "right", position: 0 },
    ]);

    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const activeDragColumn = ref<string>("");
    const currentHoveredDropzone = ref<string>("");

    const DRAG_ERROR = "Event was not a drag event.";

    function getColumnsInDropzone(dropZone: string) {
      return sortedColumns.value.filter(
        (column) => column.dropZone === dropZone
      );
    }

    function onColumnDragStart(event: DragEvent, header: string): void {
      if (event.dataTransfer !== null) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        activeDragColumn.value = header; // Assigns CSS for dragging start
      } else {
        console.error(DRAG_ERROR);
      }
    }

    function onColumnDragEnd(): void {
      // Remove preview styles
      activeDragColumn.value = "";
    }

    // Main function containing the drag & sort logic
    function onDropzoneDragOver(event: DragEvent, dropzone: string): void {
      event.preventDefault();

      if (event.dataTransfer !== null) {
        currentHoveredDropzone.value = dropzone;

        columns.value.forEach((column) => {
          if (column.header === activeDragColumn.value) {
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
          (column) => column.innerHTML !== activeDragColumn.value
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
      if (closestIndex !== undefined) {
        const columnToRight: Column = columns.value[closestIndex];
        console.log("INDEX OF COLUMN TO PLACE LEFT OF:", columnToRight);
        // WHAT NEEDS TO HAPPEN:
        // Get that items Position number
        // then set the active position to +1 higher than  the left of's position
        // TODO:
        // 1. find all the columns.value that match the current dropzone (using the func i already have)
        // 2. sort those by position
        // 3. modifiy the positions numbers for all the items relative +1 or -1 based on
        // what the columnToRight's position number is.
        // Dynamically speaking, where-ever I'm inserting the column, I need to either say, everything less gets decremented, everything to right
        // gets incremented
      } else {
        // else we're not hovering over anything, so place it to the far right position
        const dropZoneColumns = getColumnsInDropzone(
          currentHoveredDropzone.value
        );
        const farthestRightColumn = dropZoneColumns[dropZoneColumns.length - 1];

        const columnToReposition = findActiveColumn();

        if (
          columnToReposition !== undefined &&
          columnToReposition.position <
            dropZoneColumns[dropZoneColumns.length - 1].position
        ) {
          columnToReposition.position = farthestRightColumn.position + 1;
        }
      }
    }

    function findActiveColumn(): Column | undefined {
      return columns.value.find(
        (column) => column.header === activeDragColumn.value
      );
    }

    function findColumnIndexByInnerHTML(innerHTML: string): number {
      return columns.value.map((column) => column.header).indexOf(innerHTML);
    }

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
      activeDragColumn,
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
