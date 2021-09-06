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
        dropZone: "left",
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

        // Send the afterColumnIndex into the dragUpdateColumnPositions() function
        // that will adjust all the position numbers correctly, somehow
        dragUpdateColumnPositions(afterColumnIndex);

        // Below code will probably no longer be needed as all of the column positions are going to be modified and setup in
        // dragUpdateColumnPositions
        const activeColumn = findActiveColumn();

        if (activeColumn !== undefined && afterColumnIndex !== undefined) {
          activeColumn.position = afterColumnIndex;
        }
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

      // I'm looking for the index based on the one WITH the active column
      // So this might not be totally accurate... :/ Gonna need to think about this
      // But this might not be an issue
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
      // PROBABLY NEED TO PASS IN
      // the array that DOES NOT have the active column; and find the index values of those items
      // just to ensure we're setting position correctly
      // it would also already have the correct dropzone columns
      // OTHERWISE, we run the risk of not setting things properly because everything is in a single columns object

      // Based on what the closestIndex is, need to increment all column positions in the dropzone
      // or decrement in relation to where the column needs to be placed
      if (closestIndex !== undefined) {
        console.log("INDEX OF COLUMN TO PLACE LEFT OF:", closestIndex);
        // Get that items Position number
        // then set the active position to +1 higher than  the left of's position
      } else {
        // else we're not hovering over anything, so place it to the FAR right
        console.log("PLACE COLUMN TO FAR RIGHT");
        // put this to +1 higher than whatever the highest position in this div is
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
