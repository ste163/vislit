<template>
  <button ref="button" class="button" @click="setActive">
    <div class="text-wrapper" :class="isActive ? 'text-wrapper-active' : ''">
      <div class="icon-container">
        <slot name="btn-icon"></slot>
      </div>
      <slot></slot>
    </div>
    <base-button-toggle-effect
      :isActive="!isActive"
      :activeColor="activeEffectColor"
      :spanHeight="spanHeight"
      :spanWidth="spanWidth"
      :spanLeft="spanLeft"
    />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseButtonToggleEffect from "./BaseButtonToggleEffect.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  isActive: {
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

const spanHeight = ref<string>("0px");
const spanWidth = ref<string>("0px");
const spanLeft = ref<string>("0px");

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

    if (props.isActive === true) {
      // Active route onMount needs size for fill effect
      spanWidth.value = spanHeight.value = `${buttonDiameter.value}px`;
      spanLeft.value = `${
        0 - (button.value.offsetLeft + buttonRadius.value)
      }px`;
    }
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
  background-color: v-bind(baseBackgroundColor);
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
  fill: var(--black);

  /*
   margin handles positioning ->
   this could be calculated onMounted so the
   text and icon will always be properly centered
  */

  color: v-bind(baseTextColor) !important;
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
</style>
