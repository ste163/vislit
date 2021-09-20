<template>
  <div ref="column" class="column-container">
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

    <!--
  BASED ON PROP
  Flip the row reverse on flexbox on the column-content-container
  and set that column-content to the bound computed prop that reads that
-->
    <div class="resize-handle"></div>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType, ref, computed } from "vue";
import IColumn from "@/interfaces/IColumn";
import ButtonClose from "./ButtonClose.vue";
import IStore from "../store/interfaces/IStore";

const store = inject("store") as IStore;

// TODO Need prop
// for which column we're in so we know whether to
// put the re-size handle on the left or right side

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

// const column = ref<HTMLDivElement>(null);

function handleColumnClose(): void {
  const activeCol = store.application.state.columns.find(
    (col) => col.header === props.column.header
  );
  if (activeCol !== undefined) {
    activeCol.isActive = false;
  }
}

const resizeHandleLocation = computed(() =>
  props.dropZone === "left" ? "row" : "row-reverse"
);

// Create all the logic for column resize here
// and then move it into a custom hook
// which means I'll have:
// useColumnDrag
// useColumnResize
</script>

<style scoped>
.column-container {
  display: flex;
  flex-flow: row nowrap;
  flex-direction: v-bind(resizeHandleLocation);
  min-width: 10em;
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

.resize-handle:hover {
  width: 6px;
  background-color: var(--blue);
}
</style>
