<script setup lang="ts">
import { computed } from "vue";

type Props = {
  variant?: "dark" | "medium" | "light";
};

const { variant = "dark" } = defineProps<Props>();

const values = {
  light: "white",
  medium: "",
  dark: "grey", //TODO: make it match the tailwind or use this as the dark grey
};

const colorVariant = computed(() => values[variant]);
</script>

<template>
  <svg
    width="20.1"
    height="20.1"
    version="1.1"
    viewBox="0 0 5.3181 5.3181"
    xmlns="http://www.w3.org/2000/svg"
    :stroke="colorVariant"
  >
    <title>Close Icon</title>
    <path
      id="close"
      d="m4.709 4.709-4.0999-4.0999m4.0999 2.84e-5 -4.0999 4.0999"
      stroke-linecap="round"
      stroke-width="1.1918"
    />
  </svg>
</template>
