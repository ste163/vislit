<template>
  <router-link class="router-link" :to="route" draggable="false">
    <!-- base-button-toggle needs to pass in the icon prop -->
    <base-button-toggle>
      <slot></slot>
    </base-button-toggle>
  </router-link>
</template>

<script setup lang="ts">
import BaseButtonToggle from "./BaseButtonToggle.vue";
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

// Pass the store.state.activeView matches
// the props.route, set isActive === true into base-button
console.log("VIEW NAME AS PROP", props.route);
console.log("ACTIVE VIEW IN STATE", store.state.activeView);
</script>

<style scoped>
.router-link {
  text-decoration: none;
  font-size: 1rem;
  font-weight: 800;
}
</style>
