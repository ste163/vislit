<template>
  <div>Project Column Content</div>
  <button @click="isModalActive = !isModalActive">Create</button>

  <base-modal
    :is-modal-active="isModalActive"
    @close-modal="isModalActive = false"
  >
    <template v-slot:header>Create Project</template>

    TEST MODAL</base-modal
  >
</template>

<!-- Need to inject the store so we can track global project state -->

<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "./BaseModal.vue";

const isModalActive = ref<boolean>(false);
</script>
