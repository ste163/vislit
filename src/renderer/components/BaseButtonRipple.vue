<template>
  <!-- Actually, this can't be based on a boolean -->
  <!-- unless every time it's clicked it takes the -->
  <span ref="span" class="ripple">.</span>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// ACTUALLY
// would probably make the most sense
// to emit onMounted, to emit up the reference information for the span
// that way after onMount, when createRipple get clicked, it can pass everything back down that needs to
// so the only props will be the final string values or the completed, computed style object

// eslint-disable-next-line no-undef
const props = defineProps({
  isRippling: {
    type: Boolean,
    requied: true,
    default: false,
  },
});

const span = ref<HTMLSpanElement>(null);

const styles = computed(() => {
  return {
    // width: `${span.value.style.height - props.rippleDiameter}px`,
    // left: `${mouseEvent.clientX - ()}`
  };
});

// circle.style.width = circle.style.height = `${diameter}px`;
// circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
// circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
// circle.classList.add("ripple");
</script>

<style scoped>
/* Goal is to have the ripple color be passed in */
/* so that when the ripple is complete, that will be the new */
/* active background color */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.7);
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
