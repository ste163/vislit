<template>
  <button ref="button" class="base-button-click" @click="createEffect">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
  backgroundColor: {
    type: String,
    default: "var(--lightGray)",
  },
  textColor: {
    type: String,
    default: "var(--black)",
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["click"]);

function createEffect(e: MouseEvent): void {
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

<style>
.base-button-click {
  position: relative;
  padding: 0.5rem 1rem;
  overflow: hidden;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;

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
