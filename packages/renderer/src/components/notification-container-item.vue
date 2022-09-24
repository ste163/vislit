<script setup lang="ts">
import IconCheckmark from "icons/icon-checkmark.vue";
import IconClose from "icons/icon-close.vue";

// TODO:
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
    v-if="message"
    class="flex z-50 my-1 self-center text-white text-sm bg-primary px-3 py-2 rounded-md"
  >
    <div class="scale-75">
      <icon-checkmark v-if="type === 'success'" />
      <icon-close v-if="type === 'error'" :variant="'light'" />
    </div>
    <div class="mx-2">{{ message }}</div>
    <!-- TEST without a close button, but only if I can get a timer -->
    <!-- <button @click="emitCloseNotification">
      <div class="scale-50">
        <icon-close :variant="'light'" />
      </div>
    </button> -->
    <!-- TODO: experiment with some kind of CSS visual timer; either a gradient based on the timeout
    or a progress bar -->
  </div>
</template>
