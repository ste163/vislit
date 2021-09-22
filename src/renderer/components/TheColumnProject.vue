<template>
  <div>Project Column Content</div>
  <base-button-click
    @click="isModalActive = !isModalActive"
    :background-color="'var(--white)'"
    >Create</base-button-click
  >

  <form-project-create
    :is-form-modal-active="isModalActive"
    @close-form-modal="isModalActive = !isModalActive"
  />
</template>

<!-- Need to inject the store so we can track global project state -->

<script setup lang="ts">
import { ref } from "vue";
import FormProjectCreate from "./FormProjectCreate.vue";
import BaseButtonClick from "./BaseButtonClick.vue";

const isModalActive = ref<boolean>(false);
</script>
