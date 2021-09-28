<template>
  <base-button-click @click="emitClick" :background-color="'var(--white)'">
    Create
  </base-button-click>
</template>

<script setup lang="ts">
import BaseButtonClick from "./BaseButtonClick.vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(["createClick"]);

function emitClick(): void {
  emit("createClick");
}
</script>
