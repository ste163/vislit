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
    @dragenter.prevent
    @dragover.prevent
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
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header)"
      @drag="onColumnDrag($event)"
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
    @dragenter.prevent
    @dragover.prevent
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
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header)"
      @drag="onColumnDrag($event)"
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

    // Returns the ref of what column --- when I have the interface built, I can add that as the return type
    function getColumn(dropzone: string) {
      // Return only the columns with the matching dropzone number
      return columns.value.filter((column) => column.dropzone === dropzone);
    }

    function onColumnDragStart(event: DragEvent, header: string): void {
      console.log("DRAG START!");
      if (event.dataTransfer !== null) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("columnHeader", header.toString());

        // Assign CSS for the dragging start
      } else {
        console.error("Event was not a drag event.");
      }
    }

    function onColumnDrag(event: DragEvent) {
      console.log("DRAGGING");
      // Check where the column is in relation to:
      // 1. Which dropzone
      // 2. In each dropzone, where should it be in relation to the other columns

      // Also, assign CSS for preview of where the item should land
    }

    function onColumnDrop(event: DragEvent, dropzone: string): void {
      console.log("Dropping item into", dropzone);
      if (event.dataTransfer !== null) {
        // ALL checking of where the column should land, needs to occur in onColumnDrag

        const columnHeader = event.dataTransfer.getData("columnHeader");
        const column = columns.value.find(
          (column) => column.header === columnHeader
        );

        const afterElement = getDragAfterElement(
          dropzone,
          event.clientY,
          columnHeader
        );

        console.log("AFTER ELEMENT", afterElement);

        // Moves the column into the correct dropzone
        if (column !== undefined) {
          column.dropzone = dropzone;
          // Remove all dropzone CSS
        }
      } else {
        console.error("Event was not a drag event.");
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
      onColumnDrop,
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
}
</style>
