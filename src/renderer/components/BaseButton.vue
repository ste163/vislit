<template>
  <!--
Will most likely need 2 different button effects to  decide on:
1. The Active/Toggle effect for sidebars/other toggle-ables
2. The one-off click for everything else
-->
  <button ref="button" class="button" @click="setActive">
    <div class="text-wrapper" :class="!isActive ? 'text-wrapper-active' : ''">
      <slot></slot>
    </div>
    <base-button-effect
      :isActive="isActive"
      :spanHeight="spanHeight"
      :spanWidth="spanWidth"
      :spanLeft="spanLeft"
      :spanTop="spanTop"
    />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseButtonEffect from "./BaseButtonEffect.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  baseBackgroundColor: {
    type: String,
    required: true,
    default: "var(--white)",
  },
  baseTextColor: {
    type: String,
    required: true,
    default: "var(--black)",
  },
  activeTextColor: {
    type: String,
    required: true,
    default: "var(--white)",
  },
});

const button = ref<HTMLButtonElement>(null);
const buttonDiameter = ref<number>(0);
const buttonRadius = ref<number>(0);
const isActive = ref<boolean>(true); // needs to be based in

const spanHeight = ref<string>("0px");
const spanWidth = ref<string>("0px");
const spanLeft = ref<string>("0px");
const spanTop = ref<string>("0px");

function setActive(e: MouseEvent): void {
  isActive.value = !isActive.value;
  // Position span based on mouse and button size
  spanWidth.value = spanHeight.value = `${buttonDiameter.value}px`;
  spanLeft.value = `${
    e.clientX - (button.value.offsetLeft + buttonRadius.value)
  }px`;
  spanTop.value = `${
    e.clientY - (button.value.offsetTop + buttonRadius.value)
  }px`;
}

onMounted(() => {
  // Button must be on DOM before getting its size
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
  font-weight: 900;
  width: -webkit-fill-available;
  text-align: left;

  color: v-bind(baseTextColor);
  background-color: v-bind(baseBackgroundColor);
}

.text-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 9em;

  margin-top: 0.6em;
  margin-left: 1.25em;
  z-index: 1;
  transition: color 0.25s ease-in;

  /*
   margin handles positioning ->
   this could be calculated onMounted so the text and icon will always be properly centered
  */

  color: v-bind(baseTextColor) !important;
}

.text-wrapper-active {
  transition: color 0.25s ease-out;

  color: v-bind(activeTextColor) !important;
}
</style>
