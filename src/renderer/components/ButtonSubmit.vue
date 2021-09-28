<template>
  <base-button-click
    @click="emitSubmit"
    :type="buttonType"
    :background-color="'var(--primary)'"
    :text-color="'var(--white)'"
    :is-disabled="isDisabled"
    :class="{ disabled: isDisabled }"
  >
    Create
  </base-button-click>
</template>

<script setup lang="ts">
import { ButtonHTMLAttributes } from "vue";
import BaseButtonClick from "./BaseButtonClick.vue";

// TODO:
// isSubmtting prop & loading spinner
// backgroundColorDisabled prop

// eslint-disable-next-line no-undef
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
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

<style scoped>
.disabled {
  color: var(--gray);
  background-color: white;
  cursor: default;
}
</style>
