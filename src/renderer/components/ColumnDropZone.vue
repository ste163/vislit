<template>
  <!-- TODO -->
  <!-- Implement the v-if -->
  <!-- for isDraggingActive -->
  <!-- First return that value from useColumns -->
  <div
    class="dropzone"
    v-on:drop="$emit('drop', $event)"
    v-on:dragover="$emit('dragover', $event)"
    @dragenter.prevent
  >
    <slot>
      <!-- Column DropZones only take ColumnContainers -->
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type DropZone = "left" | "right";

export default defineComponent({
  props: {
    isDraggingActive: {
      type: Boolean,
      required: true,
    },
    dropZone: {
      type: String as PropType<DropZone>,
      required: true,
    },
  },
  emits: ["drop", "dragover"],
});
</script>

<style scoped>
.dropzone {
  display: flex;
  flex-flow: row nowrap;
  background-color: #3773ff50;
  min-width: 3em;
}
</style>
