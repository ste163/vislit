<template>
  <button ref="button" class="button" @click="setActive" :disabled="isDisabled">
    <div class="text-wrapper" :class="isActive ? 'text-wrapper-active' : ''">
      <div class="icon-container">
        <slot name="btn-icon"></slot>
      </div>
      <slot></slot>
    </div>
    <span :class="isActive ? 'effect-start' : 'effect-end'"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    required: true,
  },
  baseBackgroundColor: {
    type: String,
    default: "var(--white)",
  },
  baseTextColor: {
    type: String,
    default: "var(--black)",
  },
  activeTextColor: {
    type: String,
    default: "var(--white)",
  },
  activeEffectColor: {
    type: String,
    default: "var(--primary)",
  },
});

const button = ref<HTMLButtonElement | null>(null);
const buttonDiameter = ref<number>(0);
const buttonRadius = ref<number>(0);

const spanHeight = ref<string>("170px");
const spanWidth = ref<string>("170px");
const spanLeft = ref<string>("22px");

function setActive(e: MouseEvent): void {
  if (button.value !== null) {
    // Position span based on mouse and button size
    spanWidth.value = spanHeight.value = `${buttonDiameter.value}px`;
    spanLeft.value = `${
      e.clientX - (button.value.offsetLeft + buttonRadius.value)
    }px`;
  }
}

onMounted(() => {
  // Button must be on DOM before getting its size
  if (button.value !== null) {
    buttonDiameter.value = Math.max(
      button.value.clientWidth,
      button.value.clientHeight
    );
    buttonRadius.value = buttonDiameter.value / 2;
  }
});
</script>

<style scoped>
.button {
  position: relative;
  overflow: hidden;
  font-weight: 900;
  width: -webkit-fill-available;
  text-align: left;
  height: 31px;

  color: v-bind(baseTextColor);
  fill: var(--black);
  background-color: v-bind(baseBackgroundColor);
}

.button:disabled {
  color: var(--gray) !important;
  fill: var(--gray) !important;
  cursor: default;
}

/* Svg icon only inherits from .text-wrapper, not sure why; so fill is placed on .text-wrapper */
.text-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 11em;
  font-size: 0.8rem;
  margin-top: 0.55em;
  margin-left: 1.25em;
  z-index: 1;

  /*
   margin handles positioning ->
   this could be calculated onMounted so the
   text and icon will always be properly centered
  */

  transition: all 0.275s ease-in;
}

.text-wrapper-active {
  fill: v-bind(activeTextColor) !important;
  color: v-bind(activeTextColor) !important;
  transition: all 0.275s ease-out;
}

.icon-container {
  margin-right: 0.5em;
}

/* Effect */

.effect-end {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: v-bind(activeEffectColor);
  transition: 0.24s ease-in;

  height: 0;
  width: 0;
  left: 0;
  top: 0;
}

@keyframes effect-end {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.effect-start {
  position: absolute;
  border-radius: 50%;
  transform: scale(4);
  background-color: v-bind(activeEffectColor);
  transition: 0.24s ease-out;

  height: v-bind(spanHeight);
  width: v-bind(spanWidth);
  left: v-bind(spanLeft);
}

@keyframes effect-start {
  to {
    transform: scale(0);
    opacity: 1;
  }
}
</style>
