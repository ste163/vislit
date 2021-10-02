<template>
  <div class="notification-dot pulse" />
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
	dotColor: {
		type: String,
		default: "var(--primary)",
	},
	pulseColor: {
		type: String,
		required: true,
	},
});
</script>

<style scoped>
.notification-dot {
  height: 0.8em;
  width: 0.8em;
  border-radius: 50%;
  background-color: v-bind(dotColor);
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px v-bind(pulseColor);
  }
  100% {
    box-shadow: 0 0 0 7px rgba(0, 0, 0, 0);
  }
}
</style>
