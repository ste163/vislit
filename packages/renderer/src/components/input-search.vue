<script setup lang="ts">
import { ref } from "vue";

const searchValue = ref<string>("");
const isDebounced = ref<boolean>(false);

// TODO:
// Whenever the searchValue changes
// set isDebounced to true
// wait X amount of seconds
// then set isDebounced to false
// at that same time, also emit the event
// that 'inputSearchValue' or another name

// Need a test file that will check that while you're typing
// the loading indicator renders
// then after X amount of time, the emit sends the value

console.log("Hello from searchbar");
</script>

<template>
  <div>
    <!-- I want selected input blue highlight style, but that's all.
      No error...
      unless an error while fetching data, then emit the window error -->
    <input />

    delete button search icon
  </div>
</template>
