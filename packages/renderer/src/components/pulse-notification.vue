<script setup lang="ts">
interface Props {
  color: string;
}

const { color = "#3772ff" } = defineProps<Props>();
</script>

<template>
  <div class="notification-dot pulse" />
</template>

<style scoped>
.notification-dot {
  height: 0.8em;
  width: 0.8em;
  border-radius: 50%;
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
