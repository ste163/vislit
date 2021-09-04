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
      :data-position="column.position"
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
      :data-position="column.position"
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header)"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUpdate, ref, watch } from "vue";
import TheSidebar from "./components/TheSidebar.vue";

export default defineComponent({
  components: { TheSidebar },

  setup() {
    // TODO: IColumn interface, because we'll be storing the user's layout
    // Will need to store another value, as a number, for its position in the array

    // Issue is that these need to number value associated with them (ie, a position)
    // So that I can store the offset for where the columns should be located.
    // Which means that the column dropzones need to always be sorted **in a computed**
    // that is -1, 0, 1 type sorting based on the position value

    // I am not able to directly manipulate the DOM, so we have to manipulate the array
    const columns = ref([
      // BUG -
      // If Lexicons is at 0 and Notes is at 0 but in different dropzones
      // you can't properly move them because the positions aren't actually unique
      // 0 sorted by 0 will not produce the -1 or +1
      {
        header: "Settings",
        dropzone: "left",
        position: -2,
      },
      {
        header: "Projects",
        dropzone: "left",
        position: -1,
      },
      { header: "Notes", dropzone: "left", position: 1 },
      { header: "Lexicons", dropzone: "right", position: 0 },
    ]);

    // References to the DOM elements
    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const activeDragColumn = ref<string>("");

    const currentHoveredDropzone = ref<string>("");

    const DRAG_ERROR = "Event was not a drag event.";

    // Returns the ref of what column --- when I have the interface built, I can add that as the return type
    function getColumnsInDropzone(dropzone: string) {
      // Return only the columns with the matching dropzone number
      return sortedColumns.value.filter(
        (column) => column.dropzone === dropzone
      );
    }

    function onColumnDragStart(event: DragEvent, header: string): void {
      if (event.dataTransfer !== null) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";

        // Assign CSS for dragging start
        activeDragColumn.value = header;
      } else {
        console.error(DRAG_ERROR);
      }
    }

    // Need onColumnDragEnd for the @dragend
    // that removes the active style
    // otherwise, if you drop in the dashboard, it doesn't know to remove the class, only dropzones
    function onColumnDragEnd(): void {
      // Remove preview styles
      activeDragColumn.value = "";
    }

    // This function will contain the logic for
    // Which dropzone and where in the dropzone
    function onDropzoneDragOver(event: DragEvent, dropzone: string) {
      event.preventDefault();
      // Get currently dragged element
      if (event.dataTransfer !== null) {
        currentHoveredDropzone.value = dropzone;

        columns.value.forEach((column) => {
          if (column.header === activeDragColumn.value) {
            column.dropzone = dropzone;
          }
        });

        const newColumnPosition = getDragAfterColumnPosition(dropzone, event.x);

        const activeColumn = findActiveColumn();

        if (activeColumn !== undefined) {
          activeColumn.position = newColumnPosition;
        } else {
          console.error("Could not find active column");
        }
      }
    }

    function onColumnDrop(event: DragEvent, dropzone: string): void {
      if (event.dataTransfer !== null) {
        const column = findActiveColumn();
        currentHoveredDropzone.value = ""; // resets value for watcher
        // Moves the column into the correct dropzone
        if (column !== undefined) {
          column.dropzone = dropzone;
        }
      } else {
        console.error(DRAG_ERROR);
      }
    }

    function findClosestColumnPosition(
      columns: Array<HTMLDivElement>,
      x: number
    ): number {
      let newPosition = 0;
      // Still getting same issue where the childEls are all the elements INSTEAD of just the one i'm hovering over
      // Which looks like it's trying to get box items at the same time instead of just the one I want first
      for (let i = 0; i < columns.length; i++) {
        // NEED:
        // The neg inifity to compare against when we start
        // finding the closest element based on a comparison of our cursor offset and the position.
        // We need to find a SINGLE element, not looping through all.
        const childElement: HTMLDivElement = columns[i];
        let closestElementOffset: number = Number.NEGATIVE_INFINITY;

        const box: DOMRect = childElement.getBoundingClientRect();
        const cursorOffset: number = x - box.left - box.width / 2;

        const dataPositionAttribute = childElement.attributes[1]; // position in array that current element is in
        const closestPosition = parseInt(dataPositionAttribute.value);

        if (cursorOffset < 0 && cursorOffset > closestElementOffset) {
          newPosition = closestPosition + -1;
          console.log("PLACE BEFORE EL", childElement.innerHTML);
        } else {
          newPosition = closestPosition + 1;
          console.log("PLACE AFTER EL", childElement.innerHTML);
        }

        // console.log({
        //   cursorOffset,
        //   closestPosition,
        //   text: childElement.innerHTML,
        //   active: activeDragColumn.value,
        // });
      }

      return newPosition;
    }

    function getDragAfterColumnPosition(dropzone: string, x: number): number {
      let allColumnsInDropzone: Array<HTMLDivElement> = [];

      if (dropzone === "left") {
        allColumnsInDropzone = leftColumnDivs.value;
      } else {
        allColumnsInDropzone = rightColumnDivs.value;
      }

      const allColumnsExceptActive: Array<HTMLDivElement> =
        allColumnsInDropzone.filter(
          (column) => column.innerHTML !== activeDragColumn.value
        );

      return findClosestColumnPosition(allColumnsExceptActive, x);
    }

    // Add the IColumn interface as the return value
    function findActiveColumn() {
      return columns.value.find(
        (column) => column.header === activeDragColumn.value
      );
    }

    function sortColumns() {
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
