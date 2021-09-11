<template>
  <span :class="isActive ? 'ripple' : 'ripple-back'"></span>
</template>

<script setup lang="ts">
import { ref } from "vue";

// defineProps doesn't need to be imported---vetur doesn't recognize this yet
// eslint-disable-next-line no-undef
const props = defineProps({
  isActive: {
    type: Boolean,
    requied: true,
    default: true,
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

const span = ref<HTMLSpanElement>(null);
</script>

<style scoped>
/* Goal is to have the ripple color be passed in */
/* so that when the ripple is complete, that will be the new */
/* active background color */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: rgba(255, 255, 255, 0.7);
  transition: 0.15s ease-in;

  height: v-bind(spanHeight);
  width: v-bind(spanWidth);
  left: v-bind(spanLeft);
  top: v-bind(spanTop);
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-back {
  position: absolute;
  border-radius: 50%;
  transform: scale(4);
  background-color: rgba(255, 255, 255, 0.7);
  transition: 0.15s ease-out;

  height: v-bind(spanHeight);
  width: v-bind(spanWidth);
  left: v-bind(spanLeft);
  top: v-bind(spanTop);
}

@keyframes ripple-back {
  to {
    transform: scale(0);
    opacity: 1;
  }
}
</style>
