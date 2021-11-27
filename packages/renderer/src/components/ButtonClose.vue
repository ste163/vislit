<script setup lang="ts">
import AppIconClose from "./AppIconClose.vue";

// TODO:
// When needed:
// Add prop for iconColor then bind the color to the stroke

// eslint-disable-next-line no-undef
const emit = defineEmits(["click"]);

function emitClick(): void {
  emit("click");
}
</script>

<template>
  <button class="button-close" @click="emitClick">
    <app-icon-close />
  </button>
</template>

<style scoped>
.button-close {
  background-color: transparent;
  padding: 0;
  margin: 0;

  stroke: var(--gray) !important;
}

.button-close > svg {
  width: 0.7em;
}
</style>
