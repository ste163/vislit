<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isSubmitting?: boolean;
  variant?: "primary" | "secondary" | "default"; // default is light gray background, black text
}

const {
  type = "button",
  isDisabled = false,
  isSubmitting = false,
  variant = "default",
} = defineProps<Props>();

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
    background: "#f6f6f6",
  },
};

// css props can't be an object, must be separate computed state
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
    circle.classList.add("base-button-effect");

    const previousCircle =
      button.getElementsByClassName("base-button-effect")[0];
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
    class="base-button px-4 py-2 text-xs rounded-md items-center"
    @click="createEffectOnClick"
  >
    <!-- If there's an icon passed in, render it -->
    <!-- but if we're submitting, swap to spinner animation -->
    <!-- Icon fill and size may also need to be based on variant -->
    <div v-if="$slots.icon" class="mr-2">
      <slot name="icon" />
    </div>

    <!-- TODO: look up multiple v-if checks -->
    <div v-if="isSubmitting">
      <!-- spinner text changes based on variant -->
      <svg
        role="status"
        class="inline mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>

    <!--
    TEMPLATE SLOTS FOR:
    - Icon
    - Text
    -->
    <slot />
  </button>
</template>

<style>
/* Styles related to animation + props -- can't be scoped or else effect is broken*/
.base-button {
  display: flex;
  position: relative;
  overflow: hidden;
  transition: 0.2s background-color;

  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
}

span.base-button-effect {
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
