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
import Store from "@/interfaces/Store";
import { inject } from "vue";

const store = inject("store") as Store;

// eslint-disable-next-line no-undef
const props = defineProps({
  route: {
    type: String,
    required: true,
    default: "/",
  },
});

// Base-button needs to take in the active state
// and router links are active based on the store's state
console.log(store.state.activeView);
</script>

<style></style>
