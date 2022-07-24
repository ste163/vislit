<script setup lang="ts">
// pass in props for:
// type: 'success' | 'error' -- also used for displaying Icons -- Easily extensible for future types. Use an INTERFACE for this!
// message: 'string' | null
//
// TODO:
// The notification should be visible for X amount of time, then emit close
// Have an X button with onclick that emits close
// Add real icons

const emit = defineEmits(["close"]);

function emitCloseNotification(): void {
  emit("close");
}

// when the component mounts,
// setup a timer
// after the countdown of X seconds, emit Close
</script>

<template>
  <teleport to="#notification-container">
    <div class="absolute top-3 w-full flex justify-center">
      <div class="flex text-white text-sm bg-primary px-3 py-2 rounded-md">
        <!-- Icon -->
        <div>I</div>
        <div class="mx-2">Slot text</div>
        <!-- Do a real close button -->
        <button @click="emitCloseNotification">X</button>
      </div>
    </div>
  </teleport>
</template>
