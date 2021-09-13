<template>
  <router-link class="router-link" :to="route">
    <base-button>
      <!-- Will eventually need an icon slot -->
      <slot></slot>
    </base-button>
  </router-link>
</template>

<script setup lang="ts">
// Will need to have a BaseButton
// Then BaseButtonToggle
// BaseButtonFlash/Ripple
import BaseButton from "./BaseButton.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  route: {
    type: String,
    required: true,
    default: "/",
  },
});
</script>

<style></style>
