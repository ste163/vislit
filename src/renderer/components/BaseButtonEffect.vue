<template>
  <span :class="isActive ? 'effect-end' : 'effect-start'"></span>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  activeColor: {
    type: String,
    default: "var(--blue)",
  },
  spanHeight: {
    type: String,
    required: true,
    default: "0px",
  },
  spanWidth: {
    type: String,
    required: true,
    default: "0px",
  },
  spanLeft: {
    type: String,
    required: true,
    default: "0px",
  },
  spanTop: {
    type: String,
    required: true,
    default: "0px",
  },
});
</script>

<style scoped>
.effect-end {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: v-bind(activeColor);
  transition: 0.24s ease-in;

  height: 0;
  width: 0;
  left: 0;
  top: 0;
}

@keyframes effect-end {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.effect-start {
  position: absolute;
  border-radius: 50%;
  transform: scale(4);
  background-color: v-bind(activeColor);
  transition: 0.24s ease-out;

  height: v-bind(spanHeight);
  width: v-bind(spanWidth);
  left: v-bind(spanLeft);
  top: v-bind(spanTop);
}

@keyframes effect-start {
  to {
    transform: scale(0);
    opacity: 1;
  }
}
</style>
