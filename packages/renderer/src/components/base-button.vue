<script setup lang="ts">
import { computed } from "vue";
import { COLORS } from "../constants/index";

interface Props {
  variant?: "primary" | "secondary" | "default"; // default is light gray background, black text
  isDisabled?: boolean;
}

const { variant = "default", isDisabled = false } = defineProps<Props>();

const VARIANTS = {
  primary: {
    text: COLORS.WHITE,
    background: COLORS.PRIMARY,
  },
  secondary: {
    text: COLORS.BLACK,
    background: COLORS.INFO,
  },
  default: {
    text: COLORS.BLACK,
    background: COLORS.LIGHTGRAY,
  },
};

// css props can't be an object, must be separate computed state
const textColor = computed(() => VARIANTS[variant].text);
const backgroundColor = computed(() => VARIANTS[variant].background);

const emit = defineEmits(["click"]);

function createEffectOnClick(e: MouseEvent): void {
  const button = e.target as HTMLButtonElement;
  if (!button) return;

  const previousCircle = button.getElementsByClassName("base-button-effect")[0];
  if (previousCircle) previousCircle.remove();

  const circle = document.createElement("div");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.offsetX - radius}px`;
  circle.style.top = `${e.offsetY - radius}px`;
  circle.classList.add("base-button-effect");

  button.appendChild(circle);
  emit("click");
}
</script>

<template>
  <button
    ref="button"
    type="button"
    :disabled="isDisabled"
    class="base-button px-4 py-2 text-xs rounded-md items-center select-none"
    @click="createEffectOnClick"
  >
    <div v-if="$slots.icon" class="mr-2">
      <slot name="icon" />
    </div>
    <slot />
  </button>
</template>

<style scoped>
/* Styles related to v-bind needed to be scoped */
.base-button {
  display: flex;
  position: relative;
  overflow: hidden;
  transition: 0.2s background-color;

  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
}
</style>

<style>
/* Styles related to animation can't be scoped or else effect is broken */

div.base-button-effect {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: effect 0.45s linear;
  background-color: rgba(214, 214, 214, 0.7);
  pointer-events: none;
  z-index: 1000;
}

@keyframes effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
