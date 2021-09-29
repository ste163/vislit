import { computed, ComputedRef } from "vue";
import { useRoute } from "vue-router";

export default function useIsSidebarDisabled(): ComputedRef<boolean> {
  const route = useRoute();
  const isSidebarDisabled = computed(() =>
    route.name === "Welcome" ? true : false
  );

  return isSidebarDisabled;
}