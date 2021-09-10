<template>
  <span :class="isRippling ? 'ripple' : 'ripple-back'">.</span>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
  isRippling: {
    type: Boolean,
    requied: true,
    default: true,
  },
  rippleDiameter: {
    type: Number,
    required: true,
    default: 0,
  },
  rippleRadius: {
    type: Number,
    required: true,
    default: 0,
  },
});
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
  transition: 0.15s ease;
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
  transition: 0.15s ease;
}

@keyframes ripple-back {
  to {
    transform: scale(0);
    opacity: 1;
  }
}
</style>
