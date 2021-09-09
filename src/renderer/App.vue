/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <!-- TODO -->
  <!-- Only show drop-zones when the user is dragging a column -->
  <!-- Will probably need a Drop-Zone component that holds the styling -->
  <!-- Create Style Template Columns that use Slots -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <!-- Allow columns to be resizable -->
  <!-- Allow columns to only be dragged on the header -->
  <!-- DONE - Move all column logic & saving into a composable -->
  <!-- DONE - Allow columns to be dragged and dropped -->
  <!-- DONE - Allow columns to be ordered in their dropzone -->
  <the-sidebar />

  <!-- Left drop-able area -->
  <div
    class="column-dropzone"
    @drop="onColumnDrop($event, 'left')"
    @dragover="onDropZoneDragOver($event, 'left')"
    @dragenter.prevent
  >
    <div
      v-for="(column, i) in getColumnsInDropZone('left')"
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
    @dragover="onDropZoneDragOver($event, 'right')"
    @dragenter.prevent
  >
    <div
      v-for="(column, i) in getColumnsInDropZone('right')"
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
import { defineComponent, onBeforeUpdate, ref } from "vue";
import TheSidebar from "./components/TheSidebar.vue";
import useColumns from "./composables/useColumns";

export default defineComponent({
  components: { TheSidebar },

  setup() {
    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const {
      sortedColumns,
      activeDragColumnHeader,
      getColumnsInDropZone,
      onColumnDragStart,
      onColumnDragEnd,
      onDropZoneDragOver,
      onColumnDrop,
    } = useColumns(leftColumnDivs, rightColumnDivs);

    // Needed to reset references based on docs
    onBeforeUpdate(() => {
      leftColumnDivs.value = [];
      rightColumnDivs.value = [];
    });

    return {
      leftColumnDivs,
      rightColumnDivs,
      sortedColumns,
      activeDragColumnHeader,
      getColumnsInDropZone,
      onColumnDragStart,
      onDropZoneDragOver,
      onColumnDragEnd,
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
  width: 6em;
  cursor: move;
}

.column-drag-active {
  opacity: 0.5;
}
</style>
