<template>
  <base-button-toggle :isActive="true">
    <template v-slot:btn-icon>
      <slot name="icon"> </slot>
    </template>
    <slot></slot>
  </base-button-toggle>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import BaseButtonToggle from "./BaseButtonToggle.vue";
import IStore from "../store/interfaces/IStore";

const store = inject("store") as IStore;

// So I'll have a true/false for if the column is active
// If it's active, obviosuly mount it to the DOM

// eslint-disable-next-line no-undef
const props = defineProps({
  route: {
    type: String,
    required: true,
    default: "/",
  },
});
</script>

<style scoped></style>
