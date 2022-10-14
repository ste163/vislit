<script setup lang="ts">
import { ref } from "vue";

const debouncedValue = ref<string>("");
const displayValue = ref<string>("");
const isDebouncing = ref<boolean>(false);
let timeoutRef: null | NodeJS.Timeout = null;

const emit = defineEmits<{
  (e: "debouncedSearch", response: string): void;
}>();

// https://dev.to/heruujoko_38/creating-a-debounced-input-component-using-vue-composition-api-52d4
function debounceListener(e: Event) {
  if (timeoutRef) clearTimeout(timeoutRef);
  const inputValue = (e.target as HTMLInputElement)?.value ?? "";
  isDebouncing.value = true;
  displayValue.value = inputValue;
  timeoutRef = setTimeout(() => {
    debouncedValue.value = inputValue;
    isDebouncing.value = false;
    emit("debouncedSearch", inputValue);
  }, 500);
}

function handleClearClick(): void {
  displayValue.value = "";
  debouncedValue.value = "";
  emit("debouncedSearch", "");
}

// Need a test file that will check that while you're typing
// the loading indicator renders
// then after X amount of time, the emit sends the value
</script>

<template>
  <div>
    <!-- I want selected input blue highlight style, but that's all -->
    <input :value="displayValue" @input="debounceListener" />

    <div v-if="isDebouncing" data-testId="loading-spinner">LOADING</div>

    <button v-if="!isDebouncing" @click="handleClearClick">X</button>
  </div>
</template>
