<script setup lang="ts">
// Do the form first and get that saving, then the list view
// Then depending on how large it is, move to separate components
import { ref } from "vue";

const isEditViewOpen = ref<boolean>(false);
</script>

<template>
  <!-- Button that opens Note Form component -->
  <!-- 2 Column States:
    1. List View
    2. Edit View
  -->
  <div>
    <!-- List View -->
    <div v-if="!isEditViewOpen">
      <button @click="isEditViewOpen = true">Create Note</button>

      <div>
        <p>All Saved Notes</p>
      </div>
    </div>

    <!-- Edit View -->
    <div v-else>
      <button @click="isEditViewOpen = false">Back</button>
      <form>FORM OPEN!</form>
    </div>
  </div>
</template>
