<template>
  <div class="notification-dot"></div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
  dotColor: String,
});
</script>

<style scoped>
.notification-dot {
  height: 0.8em;
  width: 0.8em;
  border-radius: 50%;
  background-color: v-bind(dotColor);
}
</style>
