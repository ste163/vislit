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
    @drop="onColumnDrop($event, 1)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      v-for="(column, i) in getColumn(1)"
      :ref="
        (el) => {
          if (el) this.leftColumnDivs[i] = el;
        }
      "
      :key="column.id"
      class="column-draggable"
      draggable="true"
      @dragstart="onColumnDragStart($event, column)"
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
    @drop="onColumnDrop($event, 2)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      v-for="(column, i) in getColumn(2)"
      :ref="
        (el) => {
          if (el) this.rightColumnDivs[i] = el;
        }
      "
      :key="column.id"
      class="column-draggable"
      draggable="true"
      @dragstart="onColumnDragStart($event, column)"
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
    const columns = ref([
      {
        id: 0,
        header: "Projects",
        dropzone: 1,
      },
      { id: 1, header: "Notes", dropzone: 1 },
      { id: 2, header: "Lexicons", dropzone: 2 },
    ]);

    // References to the DOM elements
    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    // Going to need to access column being dragged by its Header and check
    // against its html inner text
    const currentlyDraggedColumnId = ref<number>();

    // Returns the ref of what column --- when I have the interface built, I can add that as the return type
    function getColumn(dropzone: number) {
      // Return only the columns with the matching dropzone number
      return columns.value.filter((column) => column.dropzone === dropzone);
    }

    // Move this to a Types directory
    type ColumnId = {
      id: number;
    };

    function onColumnDragStart(event: DragEvent, item: ColumnId): void {
      if (event.dataTransfer !== null) {
        console.log("RIGHT COLUMN DIVS", rightColumnDivs.value);
        console.log("LEFT COLUMN DIVS", leftColumnDivs.value);
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("itemId", item.id.toString());

        currentlyDraggedColumnId.value = item.id;
        console.log("COLUMN ID", currentlyDraggedColumnId.value);
      } else {
        console.error("Event was not a drag event.");
      }
    }

    function onColumnDrop(event: DragEvent, dropzone: number): void {
      console.log("Dropping item into", dropzone);
      if (event.dataTransfer !== null) {
        const itemId = event.dataTransfer.getData("itemId");
        const column = columns.value.find(
          (column) => column.id === parseInt(itemId)
        );

        const afterElement = getDragAfterElement(dropzone, event.clientY);

        // Moves the column into the correct dropzone
        if (column !== undefined) {
          column.dropzone = dropzone;
        }
      } else {
        console.error("Event was not a drag event.");
      }
    }

    // Need a sorting function for the dragging. Otherwise, it gets dumped into the right location, but not ordered in any way
    function getDragAfterElement(dropzone: number, y: number) {
      const allColumnsInDropzone = getColumn(dropzone);
      const draggableElements = allColumnsInDropzone.filter(
        (column) => column.id !== currentlyDraggedColumnId.value
      );
      console.log(
        "All Draggable elements except for currently dragged",
        draggableElements
      );

      // draggableElements.reduce(
      //   (closestElement, childElements) => {
      //     // const box = childElements.getBoundingClientRect();
      //     // console.log(box);
      //   },
      //   { offset: Number.NEGATIVE_INFINITY }
      // );
    }

    onBeforeUpdate(() => {
      leftColumnDivs.value = [];
      rightColumnDivs.value = [];
    });

    return {
      getColumn,
      onColumnDragStart,
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
