<script setup lang="ts">
// TODO:
// Add real icons
// Add styles
// add animations for enter/leave -> may need to be in a new component

import { onMounted } from "vue";

// Due to a bug with the experimental sfc-compiler for vite
// Cannot import a type/interface, it must be declared in the component-scope
// This is very problematic as it means interfaces exist in two places.
type Props = {
  id: string;
  type: "success" | "error";
  message: string | null;
};

const { id, type, message } = defineProps<Props>();

const emit = defineEmits(["close"]);

function emitCloseNotification(): void {
  emit("close", id);
}

onMounted(() => setTimeout(() => emitCloseNotification(), 5000));
</script>

<template>
  <div
    class="flex z-50 my-1 self-center text-white text-sm bg-primary px-3 py-2 rounded-md"
  >
    <!-- Icon -->
    <div>I</div>
    <div class="mx-2">{{ id }} {{ message }}</div>
    <!-- Do a real close button -->
    <button @click="emitCloseNotification">X</button>
  </div>
</template>
