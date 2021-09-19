<template>
  <div class="column-container">
    <header
      class="column-header"
      draggable="true"
      v-on:dragstart="$emit('dragstart', $event)"
      v-on:dragend="$emit('dragend', $event)"
    >
      <div class="column-header-text">
        {{ column.header }}
      </div>
      <button-close />
    </header>

    <div>
      <!-- COLUMN BODY -->
    </div>

    <div>
      <!-- COLUMN RESIZE HANDLE -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import IColumn from "@/interfaces/IColumn";
import ButtonClose from "./ButtonClose.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  column: {
    type: Object as PropType<IColumn>,
    required: true,
  },
});
</script>

<style scoped>
.column-container {
  min-width: 10em;
  background-color: var(--lightestGray);
  height: 100%;
  box-shadow: #00000045 5px 0px 10px;
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
</style>
