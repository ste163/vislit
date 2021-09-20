<template>
  <div
    class="drop-zone"
    :class="dropZoneStyle"
    v-on:drop="$emit('drop', $event)"
    v-on:dragover="$emit('dragover', $event)"
    @dragenter.prevent
  >
    <slot>
      <!-- Column Containers -->
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

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

  setup(props) {
    const dropZoneStyle = computed(() => {
      return {
        "disable-drop-zone":
          props.isDraggingActive === false && props.isDropZoneEmpty === true,
      };
    });

    return {
      dropZoneStyle,
    };
  },
});
</script>

<style scoped>
.drop-zone {
  display: flex;
  flex-flow: row nowrap;
  background-color: #3773ff50;
  min-width: 2em;
  animation: drop-zone 3s infinite;
}

@keyframes drop-zone {
  0%,
  50%,
  100% {
    background-color: #3773ff50;
  }
  25%,
  75% {
    background-color: #3773ff42;
  }
}

.disable-drop-zone {
  display: none;
}
</style>
