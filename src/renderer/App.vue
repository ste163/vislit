/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <!-- TODO -->
  <!-- Create Style Template Columns that use Slots -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <!-- Allow columns to be resizable -->
  <!-- Allow columns to only be dragged on the header -->
  <!-- DONE - Only show drop-zones when the user is dragging a column -->
  <!-- DONE - DropZone Component-->
  <!-- DONE - Move all column logic & saving into a composable -->
  <!-- DONE - Allow columns to be dragged and dropped -->
  <!-- DONE - Allow columns to be ordered in their dropzone -->
  <the-sidebar />

  <!-- Left drop-able area -->
  <column-drop-zone
    :dropZone="'left'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isLeftColumnDivEmpty"
    @drop="onColumnDrop($event, 'left')"
    @dragover="onDropZoneDragOver($event, 'left')"
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
  </column-drop-zone>

  <main class="dashboard">
    <router-view />
  </main>

  <!-- Right drop-able area -->
  <column-drop-zone
    :dropZone="'right'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isRightColumnDivEmpty"
    @drop="onColumnDrop($event, 'right')"
    @dragover="onDropZoneDragOver($event, 'right')"
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
  </column-drop-zone>
</template>

<script lang="ts">
// CONVERT TO USE THE setup attribute in script tag!
import { computed, defineComponent, onBeforeUpdate, ref } from "vue";
import TheSidebar from "./components/TheSidebar.vue";
import ColumnDropZone from "./components/ColumnDropZone.vue";
import useColumns from "./composables/useColumns";

export default defineComponent({
  components: { TheSidebar, ColumnDropZone },

  setup() {
    const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
    const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

    const {
      sortedColumns,
      isDraggingActive,
      activeDragColumnHeader,
      getColumnsInDropZone,
      onColumnDragStart,
      onColumnDragEnd,
      onDropZoneDragOver,
      onColumnDrop,
    } = useColumns(leftColumnDivs, rightColumnDivs);

    function checkIsDropZoneEmpty(dropZone: string): boolean {
      const dropZoneColumns = sortedColumns.value.filter(
        (column) => column.dropZone === dropZone
      );
      return dropZoneColumns.length === 0 ? true : false;
    }

    const isLeftColumnDivEmpty = computed(() => checkIsDropZoneEmpty("left"));
    const isRightColumnDivEmpty = computed(() => checkIsDropZoneEmpty("right"));

    // Needed to reset references based on docs
    onBeforeUpdate(() => {
      leftColumnDivs.value = [];
      rightColumnDivs.value = [];
    });

    return {
      leftColumnDivs,
      isLeftColumnDivEmpty,
      rightColumnDivs,
      isRightColumnDivEmpty,
      sortedColumns,
      isDraggingActive,
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

.column-draggable {
  background-color: white;
  border-right: 2px black solid;
  width: 6em;
  cursor: move;
}

.column-drag-active {
  opacity: 0.5;
}
</style>
