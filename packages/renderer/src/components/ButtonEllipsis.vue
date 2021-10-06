<script setup lang="ts">

// eslint-disable-next-line no-undef
const props = defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
  <button
    class="button-ellipsis"
    :class="{'active': isActive}"
  >
    <svg
      width="7"
      height="21"
      version="1.1"
      viewBox="0 0 1.3229 5.3181"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="ellipsis"
        d="m0.66146 0.013229a0.65468 0.65468 0 0 1 0.65467 0.65468 0.65468 0.65468 0 0 1-0.65467 0.65468 0.65468 0.65468 0 0 1-0.65468-0.65468 0.65468 0.65468 0 0 1 0.65468-0.65468zm0 1.9912a0.65468 0.65468 0 0 1 0.65467 0.65468 0.65468 0.65468 0 0 1-0.65467 0.65468 0.65468 0.65468 0 0 1-0.65468-0.65468 0.65468 0.65468 0 0 1 0.65468-0.65468zm0 1.9911a0.65468 0.65468 0 0 1 0.65467 0.65468 0.65468 0.65468 0 0 1-0.65467 0.65468 0.65468 0.65468 0 0 1-0.65468-0.65468 0.65468 0.65468 0 0 1 0.65468-0.65468z"
        stroke-linecap="round"
        stroke-linejoin="bevel"
        stroke-width=".0087918"
      />
    </svg>
  </button>
</template>

<style scoped>
.button-ellipsis {
  background-color: transparent;
  padding: 0 0.25em;
}

.button-ellipsis > svg > path {
  fill: var(--gray);
}

.button-ellipsis.active > svg > path {
  fill: var(--primary);
}
</style>