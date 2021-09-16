<template>
  <router-link class="router-link" :to="route" draggable="false">
    <base-button-toggle :isActive="isActiveRoute">
      <template v-slot:btn-icon>
        <slot name="icon"> </slot>
      </template>
      <slot></slot>
    </base-button-toggle>
  </router-link>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import BaseButtonToggle from "./BaseButtonToggle.vue";
import IStore from "@/interfaces/IStore";

const store = inject("store") as IStore;

// eslint-disable-next-line no-undef
const props = defineProps({
  route: {
    type: String,
    required: true,
    default: "/",
  },
});

const isActiveRoute = computed(() =>
  store.state.activeView === props.route ? true : false
);
</script>

<style scoped>
.router-link {
  text-decoration: none;
  font-size: 1rem;
  font-weight: 800;
}
</style>
