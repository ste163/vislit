/* eslint-disable */
// el needs to be any type
// https://stackoverflow.com/questions/36170425/detect-click-outside-element -> comes from Pablo Huet Carrasco at "Complete case for vue 3"
import { DirectiveBinding } from "vue";

const clickOutside = {
  beforeMount: (el: any, binding: DirectiveBinding): void => {
    el.eventSetDrag = () => {
      el.setAttribute("data-dragging", "yes");
    };
    el.eventClearDrag = () => {
      el.removeAttribute("data-dragging");
    };
    el.eventOnClick = (event: MouseEvent): void => {
      const dragging = el.getAttribute("data-dragging");
      // Check that the click was outside the el and its children, and wasn't a drag
      if (
        !document
          ?.elementsFromPoint(event?.clientX, event?.clientY)
          ?.includes(el) &&
        !dragging
      ) {
        // call method provided in attribute value
        binding.value(event);
      }
    };
    // touch and data-dragging are safari-specific
    document.addEventListener("touchstart", el.eventClearDrag);
    document.addEventListener("touchmove", el.eventSetDrag);
    document.addEventListener("click", el.eventOnClick);
    document.addEventListener("touchend", el.eventOnClick);
  },
  unmounted: (el: any): void => {
    document.removeEventListener("touchstart", el.eventClearDrag);
    document.removeEventListener("touchmove", el.eventSetDrag);
    document.removeEventListener("click", el.eventOnClick);
    document.removeEventListener("touchend", el.eventOnClick);
    el.removeAttribute("data-dragging");
  },
};

export { clickOutside };
