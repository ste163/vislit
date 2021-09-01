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
      v-for="(column, i) in getColumn('left')"
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
      @drag="onColumnDrag($event, 'left')"
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
      v-for="(column, i) in getColumn('right')"
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
      @drag="onColumnDrag($event, 'right')"
    >
      {{ column.header }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate, ref } from "vue";
import TheSidebar from "./components/TheSidebar.vue";

export default defineComponent({
  components: { TheSidebar },

  setup() {
    // TODO: IColumn interface, because we'll be storing the user's layout
    // Will need to store another value, as a number, for its position in the array
    const columns = ref([
      {
        header: "Projects",
        dropzone: "left",
      },
      { header: "Notes", dropzone: "left" },
      { header: "Lexicons", dropzone: "right" },
    ]);

    // References to the DOM elements
    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const activeDragColumn = ref<string>("");

    const DRAG_ERROR = "Event was not a drag event.";

    // Returns the ref of what column --- when I have the interface built, I can add that as the return type
    function getColumn(dropzone: string) {
      // Return only the columns with the matching dropzone number
      return columns.value.filter((column) => column.dropzone === dropzone);
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

    // This might not be used at all; keeping for now
    // CSS is setup on the columnDragStart and removed onColumnDrop
    function onColumnDrag(event: DragEvent, dropzone: string): void {
      if (event.dataTransfer !== null) {
        // Check where the column is in relation to:
        // 1. Which dropzone are we hovered over?
        // 2. In each dropzone, where should it be in relation to the other columns?
      } else {
        console.error(DRAG_ERROR);
      }

      // Also, assign CSS for preview of where the item should land
    }

    // This function will contain the logic for
    // Which dropzone and where in the dropzone
    function onDropzoneDragOver(event: DragEvent, dropzone: string) {
      event.preventDefault();

      // Get currently dragged element
      if (event.dataTransfer !== null) {
        let allColumnsInDropzone: Array<HTMLDivElement> = [];

        if (dropzone === "left") {
          allColumnsInDropzone = leftColumnDivs.value;
        } else {
          allColumnsInDropzone = rightColumnDivs.value;
        }

        const currentlyDraggedColumn: Array<HTMLDivElement> =
          allColumnsInDropzone.filter(
            (column) => column.innerHTML === activeDragColumn.value
          );

        console.log(currentlyDraggedColumn);

        columns.value.forEach((column) => {
          if (column.header === activeDragColumn.value) {
            column.dropzone = dropzone;
          }
        });
      }
    }

    function onColumnDrop(event: DragEvent, dropzone: string): void {
      console.log("Dropping item into", dropzone);
      if (event.dataTransfer !== null) {
        // ALL checking of where the column should land, needs to occur in onColumnDrag

        const column = columns.value.find(
          (column) => column.header === activeDragColumn.value
        );

        // const afterElement = getDragAfterElement(
        //   dropzone,
        //   event.clientY,
        //   columnHeader
        // );

        // Moves the column into the correct dropzone
        if (column !== undefined) {
          column.dropzone = dropzone;
          // Remove all dropzone CSS
          activeDragColumn.value = "";
        }
      } else {
        console.error(DRAG_ERROR);
      }
    }

    // Need a sorting function for the dragging. Otherwise, it gets dumped into the right location, but not ordered in any way
    function getDragAfterElement(
      dropzone: string,
      y: number,
      columnHeader: string
    ): void {
      let allColumnsInDropzone: Array<HTMLDivElement> = [];

      if (dropzone === "left") {
        allColumnsInDropzone = leftColumnDivs.value;
      } else {
        allColumnsInDropzone = rightColumnDivs.value;
      }

      // Remove the Any type
      const allColumnsExceptSelected: Array<any> = allColumnsInDropzone.filter(
        (column) => column.innerHTML !== columnHeader
      );

      console.log(
        "All Draggable elements except for currently dragged",
        allColumnsExceptSelected
      );

      // Now I need to get the bounding boxes of the all columns except selected
      // And compare their center points to where the dragged element is.
      // Which means I need to be tracking the dragged elements location in real-time

      // This fails currently because the initial value gets set to NOT an element
      // but a number. So reduce cannot work this way.
      // Will need to just do a forEach loop over the draggable elements
      // and do some comparison on the positions
      // return allColumnsExceptSelected.reduce(
      //   (closest: HTMLDivElement, child: HTMLDivElement) => {
      //     const boundingBox = child.getBoundingClientRect();

      //     const offset = y - boundingBox.top - boundingBox.height / 2;

      //     if (offset < 0 && offset > closest.offsetLeft) {
      //       console.log("CHILD", child);
      //       return { offset: offset, element: child };
      //     } else {
      //       console.log("CLOSEST", closest);
      //       return { offset: offset, element: closest };
      //     }
      //   },
      //   { offset: Number.NEGATIVE_INFINITY }
      // ).element;
    }

    // Needed to reset references
    onBeforeUpdate(() => {
      leftColumnDivs.value = [];
      rightColumnDivs.value = [];
    });

    return {
      getColumn,
      onColumnDragStart,
      onColumnDrag,
      onDropzoneDragOver,
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
