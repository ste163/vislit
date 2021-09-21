<template>
  <div>Project Column Content</div>
  <button @click="isModalActive = !isModalActive">Create</button>

  <form-project-create
    :is-form-modal-active="isModalActive"
    @close-form-modal="isModalActive = !isModalActive"
  />
</template>

<!-- Need to inject the store so we can track global project state -->

<script setup lang="ts">
import { ref } from "vue";
import FormProjectCreate from "./FormProjectCreate.vue";

const isModalActive = ref<boolean>(false);
</script>
