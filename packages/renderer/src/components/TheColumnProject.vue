<!-- Handles all possible content for Project Column (list & form) -->
<script setup lang="ts">
import { ref } from "vue";
import TheColumnProjectList from "./TheColumnProjectList.vue";
import FormProjectCreate from "./FormProjectCreate.vue"; // maybe rename to TheColumnProjectForm

// Need to inject the store so we can track global project state

const isFormActive = ref<boolean>(false);

function setActiveColumnView(): void {
  isFormActive.value = !isFormActive.value;
}
</script>

<template>
  <transition-group name="slide-fade">
    <the-column-project-list
      v-if="!isFormActive"
      :key="1"
      @create-click="setActiveColumnView"
    />
    <form-project-create
      v-if="isFormActive"
      :key="2"
      @go-back="setActiveColumnView"
    />
  </transition-group>
</template>

<style scoped>
/* Need to move into a global area so all columns can use this */
.slide-fade-enter-active,
.slide-fade-leave-active {
  position: absolute;
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
