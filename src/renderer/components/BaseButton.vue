<template>
  <button ref="button" class="button" @click="setActive">
    <base-button-ripple
      :isActive="isActive"
      :spanHeight="spanHeight"
      :spanWidth="spanWidth"
      :spanLeft="spanLeft"
      :spanTop="spanTop"
    />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseButtonRipple from "./BaseButtonRipple.vue";

const button = ref<HTMLButtonElement>(null);
const buttonDiameter = ref<number>(0);
const buttonRadius = ref<number>(0);
const isActive = ref<boolean>(true);

const spanHeight = ref<string>("0px");
const spanWidth = ref<string>("0px");
const spanLeft = ref<string>("0px");
const spanTop = ref<string>("0px");

function setActive(e: MouseEvent): void {
  isActive.value = !isActive.value;

  spanWidth.value = spanHeight.value = `${buttonDiameter.value}px`;
  spanLeft.value = `${
    e.clientX - (button.value.offsetLeft + buttonRadius.value)
  }px`;
  spanTop.value = `${
    e.clientY - (button.value.offsetTop + buttonRadius.value)
  }px`;
}

onMounted(() => {
  // Get size for ripple based on button
  buttonDiameter.value = Math.max(
    button.value.clientWidth,
    button.value.clientHeight
  );
  buttonRadius.value = buttonDiameter.value / 2;
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
