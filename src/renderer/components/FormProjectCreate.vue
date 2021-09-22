<template>
  <div>
    <!-- Must have a single root node to animate with <transition-group /> -->
    <button @click="emitGoBack">Back</button>
    <form>
      <input type="text" placeholder="title" />

      <input type="text" placeholder="type" />

      <input type="text" placeholder="description" />

      <!-- Make a create button component that has isDisabled and isActive props -->
      <button>Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
// const props = defineProps({
// isFormModalActive: {
//   type: Boolean,
//   required: true,
//   default: false,
// },
// });

// eslint-disable-next-line no-undef
const emit = defineEmits(["goBack"]);

function emitGoBack(): void {
  emit("goBack");
}
</script>
