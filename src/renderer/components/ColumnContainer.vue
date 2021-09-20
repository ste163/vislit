<template>
  <div ref="columnElement" class="column-container">
    <div class="column-content-container">
      <header
        class="column-header"
        draggable="true"
        v-on:dragstart="$emit('dragstart', $event)"
        v-on:dragend="$emit('dragend', $event)"
      >
        <div class="column-header-text">
          {{ column.header }}
        </div>
        <button-close @click="handleColumnClose" />
      </header>

      <div>
        <!-- COLUMN BODY -->
      </div>
    </div>

    <div
      class="resize-handle"
      :class="isResizing ? 'resize-handle-active' : ''"
      @mousedown="handleResizeMouseDown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType, ref, computed } from "vue";
import IColumn from "@/interfaces/IColumn";
import ButtonClose from "./ButtonClose.vue";
import IStore from "../store/interfaces/IStore";

const store = inject("store") as IStore;

// eslint-disable-next-line no-undef
const props = defineProps({
  column: {
    type: Object as PropType<IColumn>,
    required: true,
  },
  dropZone: {
    type: String,
    required: true,
  },
});

const isResizing = ref<boolean>(false);
const columnWidth = ref<string>("10em");
const columnElement = ref<HTMLDivElement | null>(null);

function handleColumnClose(): void {
  const activeCol = store.application.state.columns.find(
    (col) => col.header === props.column.header
  );
  if (activeCol !== undefined) {
    activeCol.isActive = false;
  }
}

// TODO:
// Need global state for:
// dropZoneLeftWidth
// dropZoneRightWidth
// then all the columns.width
// This will be stored as '322px' values
// I'll need to:
// Add up the current columns in each dropZone and set a
// dropZoneLeftMaxWidth
// dropZoneRightMaxWidth
// and ensure that when we're resizing, we're always less than that or ===

// Then, once all that is good, move into a composable
// so that I can useResize anywhere! OR move it into a
// useColumnResize composable
function handleResizeMouseDown(e: MouseEvent): void {
  isResizing.value = true;
  const startingX = e.clientX;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  function onMouseMove(e: MouseEvent): void {
    if (columnElement.value !== null) {
      const columnToResize = columnElement.value.getBoundingClientRect();
      columnWidth.value = `${columnToResize.width - (startingX - e.clientX)}px`;
    }
  }

  function onMouseUp(): void {
    isResizing.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }
}

const resizeHandleLocation = computed(() =>
  props.dropZone === "left" ? "row" : "row-reverse"
);
</script>

<style scoped>
.column-container {
  display: flex;
  flex-flow: row nowrap;
  flex-direction: v-bind(resizeHandleLocation);
  min-width: 10em;
  width: v-bind(columnWidth);
  max-width: 100%;
  background-color: var(--lightestGray);
  height: 100%;
}

.column-content-container {
  flex-grow: 1;
}
.column-header {
  background-color: var(--lightGray);
  display: flex;
  flex-flow: row nowrap;
  padding: 0.5em 0.75em 0.5em 0.75em;
  justify-content: space-between;
  cursor: move;
}
.column-header-text {
  font-size: 0.8rem;
  letter-spacing: var(--letterSpacingSmall);
}

.resize-handle {
  height: 100%;
  width: 3px;
  background-color: var(--columnHeader);
  cursor: col-resize;
  transition: 0.2s all;
}

.resize-handle:hover,
.resize-handle-active {
  width: 6px;
  background-color: var(--blue);
}
</style>
