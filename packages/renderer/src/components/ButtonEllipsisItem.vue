<script setup lang="ts">
</script>

<!-- Does not use any special button components because it ellipsis menu automatically closes -->
<template>
  <button class="ellipsis-button-item">
    <slot />
  </button>
</template>

<style scoped>
.ellipsis-button-item {
  background-color: transparent;
  font-weight: 600;
  font-size: 0.8em;
  text-align: left;
  border-radius: 0;
  transition: all 0.1s;
}

.ellipsis-button-item:active {
  background-color: var(--primary);
  color: var(--white);
}
</style>