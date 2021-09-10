<template>
  <!-- TODO -->
  <!-- Implement the v-if -->
  <!-- for isDraggingActive -->
  <!-- First return that value from useColumns -->
  <!-- JK, just change the class from display  -->
  <!-- The class will be based on whether or not there is any length -->
  <!-- Almost like 2 things need to be passedin: -->
  <!-- 1. isDraggingActive -->
  <!-- 2. isDropZoneEmpty -->
  <!-- 
    So now,
    when the isDropZoneEmpty === true && isDraggingActive === false
    display: none on the dropZone
    if isDraggingActive === true, always show the drop-zone
    and add a slight pulse effect to the hover
   -->
  <div
    class="drop-zone"
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
    isDropZoneEmpty: {
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
.drop-zone {
  display: flex;
  flex-flow: row nowrap;
  background-color: #3773ff50;
  min-width: 3em;
}
</style>
