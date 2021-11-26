<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
import BaseButtonClick from "./BaseButtonClick.vue";

// TODO:
// isSubmtting prop & loading spinner

// eslint-disable-next-line no-undef
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  backgroundColorDisabled: {
    type: String,
    default: "var(--white)",
  },
});

const buttonType = {
  type: "submit",
} as ButtonHTMLAttributes;

// eslint-disable-next-line no-undef
const emit = defineEmits(["submitClick"]);

function emitSubmit(): void {
  emit("submitClick");
}
</script>

<template>
  <base-button-click
    :type="buttonType"
    :background-color="'var(--primary)'"
    :text-color="'var(--white)'"
    :is-disabled="isDisabled"
    :class="{ disabled: isDisabled }"
    @click="emitSubmit"
  >
    Create
  </base-button-click>
</template>

<style scoped>
.disabled {
  color: var(--gray);
  cursor: default;
  transition: 0.2s background-color;

  background-color: v-bind(backgroundColorDisabled);
}
</style>
