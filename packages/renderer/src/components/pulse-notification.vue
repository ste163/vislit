<script setup lang="ts">
interface Props {
  color: string;
}

const { color } = defineProps<Props>();
</script>

<template>
  <div class="color pulse w-3 h-3 rounded-full" />
</template>

<style scoped>
.color {
  background-color: v-bind(color);
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px v-bind(color);
  }
  100% {
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0);
  }
}
</style>
