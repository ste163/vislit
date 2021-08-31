<template>
  <!-- TODO -->
  <!-- Columns will be templates -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be resizable -->
  <!-- Allow columns to be dragged and dropped -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <the-sidebar />

  <!-- If the drop-zones are empty, only show them when the user is dragging a column -->

  <!-- Left drop-able area -->
  <div
    class="column-dropzone"
    @drop="onColumnDrop($event, 1)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      v-for="column in getColumn(1)"
      :key="column.id"
      class="column-draggable"
      draggable="true"
      @dragstart="onDragStart($event, column)"
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
      v-for="column in getColumn(2)"
      :key="column.id"
      class="column-draggable"
      draggable="true"
      @dragstart="onDragStart($event, column)"
    >
      {{ column.header }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TheSidebar from "./components/TheSidebar.vue";

export default defineComponent({
  components: { TheSidebar },

  // TODO: IColumn interface, because we'll be storing the user's layout
  setup() {
    const columns = ref([
      {
        id: 0,
        header: "Projects",
        dropzone: 1,
      },
      { id: 1, header: "Notes", dropzone: 1 },
      { id: 2, header: "Lexicons", dropzone: 2 },
    ]);

    function getColumn(dropzone: number) {
      return columns.value.filter((column) => column.dropzone === dropzone);
    }

    // Item needs to be an interface with something with JUST an id, like IHasId
    // onDragStart can be moved into a hook because it will just require items to have an ID using the IHasId interface
    // Or maybe it's just a type of anything with an id
    function onDragStart(event: DragEvent, item: any) {
      console.log(item);
      if (event.dataTransfer !== null) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("itemId", item.id);
      } else {
        console.error("Event was not a drag event.");
      }
    }

    // onColumnDrop is currently only for the columns. Which isn't a problem. We can have a drop for the columns
    // and then a drop for list items
    function onColumnDrop(event: DragEvent, dropzone: number) {
      if (event.dataTransfer !== null) {
        const itemId = event.dataTransfer.getData("itemId");
        const column = columns.value.find(
          (column) => column.id === parseInt(itemId)
        );

        if (column !== undefined) {
          column.dropzone = dropzone;
        }
      } else {
        console.error("Event was not a drag event.");
      }
    }

    return {
      getColumn,
      onDragStart,
      onColumnDrop,
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
