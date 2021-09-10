<template>
  <button ref="button" class="button" @click="createRipple">
    <base-button-ripple v-if="isRippling" />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseButtonRipple from "./BaseButtonRipple.vue";

const button = ref<HTMLButtonElement>(null);
const rippleDiameter = ref<number>(0);
const rippleRadius = ref<number>(0);
const isRippling = ref<boolean>(false);

function createRipple(e: MouseEvent): void {
  isRippling.value = !isRippling.value;

  if (isRippling.value === false) {
    isRippling.value === true;
  }
}

onMounted(() => {
  // Get size for ripple based on button
  rippleDiameter.value = Math.max(
    button.value.clientWidth,
    button.value.clientHeight
  );
  rippleRadius.value = rippleDiameter.value / 2;
});
</script>

<style scoped>
.button {
  position: relative;
  overflow: hidden;

  transition: background 400ms;
  color: #fff;
  background-color: #6200ee;
  padding: 1rem 2rem;
  font-size: 1rem;
  outline: 0;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
