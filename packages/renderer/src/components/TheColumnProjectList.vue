<script setup lang="ts">
import BaseButtonClick from "./BaseButtonClick.vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(["createClick"]);

function emitClick(): void {
	emit("createClick");
}
</script>

<template>
  <base-button-click
    :background-color="'var(--white)'"
    @click="emitClick"
  >
    Create
  </base-button-click>
</template>
