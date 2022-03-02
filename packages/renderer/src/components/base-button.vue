<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  variant?: "primary" | "secondary" | "default"; // default is light gray background, black text
}

const {
  type = "button",
  isDisabled = false,
  variant = "default",
} = defineProps<Props>();

// See if it's possible to double up var() and tailwind so I don't have to
// hard-code the colors
const variants = {
  primary: {
    text: "white",
    background: "#3772ff",
  },
  secondary: {
    text: "#333333",
    background: "#fdca40",
  },
  default: {
    text: "#333333",
    background: "bg-gray-500",
  },
};

const textColor = computed(() => variants[variant].text);
const backgroundColor = computed(() => variants[variant].background);

const emit = defineEmits(["click"]);

function createEffectOnClick(e: MouseEvent): void {
  emit("click");
  const button = e.target as HTMLButtonElement;

  if (button) {
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.offsetX - radius}px`;
    circle.style.top = `${e.offsetY - radius}px`;
    circle.classList.add("base-button-click-effect");

    const previousCircle = button.getElementsByClassName(
      "base-button-click-effect"
    )[0];
    if (previousCircle) {
      previousCircle.remove();
    }

    button.appendChild(circle);
  }
}
</script>

<template>
  <button
    ref="button"
    :type="type"
    :disabled="isDisabled"
    class="base-button-click"
    @click="createEffectOnClick"
  >
    <slot />
  </button>
</template>

<style>
.base-button-click {
  position: relative;
  padding: 0.5rem 1rem;
  overflow: hidden;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s background-color;

  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
}

span.base-button-click-effect {
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
