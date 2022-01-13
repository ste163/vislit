<!-- Convert to tailwind & not component -->
<template>
  <h2 class="column-list-header">
    <slot />
  </h2>
</template>

<style scoped>
.column-list-header {
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: var(--letterSpacingSmall);
  margin: 0.5em 0;
}
</style>
