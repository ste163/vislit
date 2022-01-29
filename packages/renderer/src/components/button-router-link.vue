<script setup lang="ts">
import { computed, inject } from "vue";
import BaseButtonToggle from "./base-button-toggle.vue";
import type { Store } from "../store";
import useIsSidebarDisabled from "../composables/use-is-sidebar-disabled";

const store = inject("store") as Store;

const props = defineProps({
  route: {
    type: String,
    required: true,
    default: "/",
  },
});

const isDisabled = useIsSidebarDisabled();

const isActiveRoute = computed(() =>
  store.state.activeView === props.route ? true : false
);
</script>

<template>
  <router-link
    class="router-link"
    :class="{ 'router-link-disabled': isDisabled }"
    :to="route"
    draggable="false"
  >
    <base-button-toggle :is-active="isActiveRoute" :is-disabled="isDisabled">
      <template #btn-icon>
        <slot name="icon" />
      </template>
      <slot />
    </base-button-toggle>
  </router-link>
</template>

<style scoped>
.router-link {
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 800;
}

.router-link-disabled {
  pointer-events: none;
}
</style>
