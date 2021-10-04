<script setup lang="ts">
import AppIconBack from "./AppIconBack.vue";

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
  <button
    class="button-back"
    @click="emitClick"
  >
    <app-icon-back />
  </button>
</template>

<style scoped>
.button-back {
  background-color: transparent;
  padding: 0;

  stroke: var(--gray) !important;
  fill: var(--gray) !important;
}

.button-back > svg {
  width: 1em;
}
</style>
