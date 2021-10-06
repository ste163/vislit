<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
	isEllipsisMenuActive: {
		type: Boolean,
		default: false,
	},
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["clickOutside"]);
</script>

<template>
  <div class="card">
    <header class="card-header">
      <h1>
        <slot name="header" />
      </h1>

      <div v-click-outside="() => emit('clickOutside')">
        <slot name="ellipsis-button" />
        <div
          v-if="isEllipsisMenuActive"
          class="ellipsis-menu"
        >
          <slot name="ellipsis-menu" />
        </div>
      </div>
    </header>

    <div>
      <slot>
        <!-- Should be BaseCardContent components -->
      </slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  padding: 1em 1em 1.5em 2em;
  border-radius: 0.35em;
  width: clamp(370px, 50vw, 500px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.ellipsis-menu {
  display: flex;
  flex-flow: column nowrap;
  position: absolute;
  right: 0;
  background-color: var(--white);
  width: 100px;
  height: 65px;
  border-radius: 4px;
  box-shadow: #00000047 0px 2px 6px;
  z-index: 1;
}
</style>
