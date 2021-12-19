<script setup lang="ts">
import type { PropType } from "vue";
import { inject, ref, computed } from "vue";
import type Store from '../store/Store';
import type { Column } from "interfaces";
import ButtonClose from "./ButtonClose.vue";
import TheColumnProject from "./TheColumnProject.vue";
import TheColumnNote from "./TheColumnNote.vue";
import TheColumnLexicon from "./TheColumnLexicon.vue";
import TheColumnSetting from "./TheColumnSetting.vue";

const store = inject("store") as Store;

const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    required: true,
  },
  dropZone: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["dragstart", "dragend"]);

const isResizing = ref<boolean>(false);
const columnWidth = ref<string>("300px");
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

// ALSO: Need to check column default widths against the dropZone max width:
// If the widthOfColumnsInDropZone would be greater than the dropZoneMaxWidth, then
// show an error message -> UNLESS it can open that item on the other dropZone.

// Then, once all that is good, move into a composable
// so that I can useResize anywhere! OR move it into a
// useColumnResize composable
function handleResizeMouseDown(e: MouseEvent): void {
  isResizing.value = true;
  const startingX = e.clientX;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  const columnToResize =
    columnElement.value !== null
      ? columnElement.value.getBoundingClientRect()
      : null;

  function onMouseMove(e: MouseEvent): void {
    if (columnElement.value !== null && columnToResize !== null) {
      if (props.dropZone === "left") {
        columnWidth.value = `${
          columnToResize.width - (startingX - e.clientX)
        }px`;
      } else {
        columnWidth.value = `${
          columnToResize.width + (startingX - e.clientX)
        }px`;
      }
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

<template>
  <div ref="columnElement" class="column-container">
    <div class="column-content-container">
      <header
        class="column-header"
        draggable="true"
        @dragstart="$emit('dragstart', $event)"
        @dragend="$emit('dragend', $event)"
      >
        <div class="column-header-text">
          {{ column.header }}
        </div>
        <button-close class="column-header-close" @click="handleColumnClose" />
      </header>

      <div class="column-content">
        <the-column-project v-if="column.header === 'Projects'" />
        <the-column-note v-if="column.header === 'Notes'" />
        <the-column-lexicon v-if="column.header === 'Lexicons'" />
        <the-column-setting v-if="column.header === 'Settings'" />
      </div>
    </div>

    <div
      class="resize-handle"
      :class="isResizing ? 'resize-handle-active' : ''"
      @mousedown="handleResizeMouseDown"
    />
  </div>
</template>

<style>
.column-container {
  display: flex;
  flex-flow: row nowrap;
  flex-direction: v-bind(resizeHandleLocation);
  min-width: 200px;
  width: v-bind(columnWidth);
  max-width: 700px;
  background-color: var(--lightestGray);
  height: 100%;
}

.column-content-container {
  flex-grow: 1;
  width: inherit;
}

.column-header {
  display: flex;
  flex-flow: row nowrap;
  padding: 0.5em 0.75em 0.5em 0.75em;
  justify-content: space-between;
  align-items: center;
  background-color: var(--lightGray);
  cursor: move;
}

.column-header-text {
  font-size: 0.8rem;
  letter-spacing: var(--letterSpacingSmall);
}

.column-header-close {
  margin-top: 0.1em !important;
}

.column-content {
  font-size: 0.85em;
  padding: 0.5em 0;
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
  background-color: var(--primary);
}
</style>
