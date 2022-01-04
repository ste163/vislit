// Formats date object into 'Friday, October 8, 2021' computed prop
import { computed } from "vue";
import type { ComputedRef } from "vue";

export default function useDateFormatFull(
  date: Date | undefined | null
): ComputedRef<string> | null {
  if (date) {
    const formattedDate = computed(() => {
      // Sometimes date is saved as a string, always re-build date object
      const convertedDate = date.toString();
      const newDate = new Date(convertedDate);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      } as any;
      return new Intl.DateTimeFormat("en-US", options).format(newDate);
    });

    return formattedDate;
  } else {
    return null;
  }
}
