<script setup lang="ts">
import { NotificationContainerItem } from "components";
import { NotificationItem } from "renderer-interfaces";

const props = defineProps({
  notificationItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["closeItem"]);

function handleCloseNotificationItem(id: string): void {
  emit("closeItem", id);
}
</script>

<template>
  <div>
    <teleport to="#notification-container">
      <div
        class="absolute w-full flex flex-col justify-center pointer-events-none"
      >
        <notification-container-item
          v-for="{ id, type, message } in (props.notificationItems as NotificationItem[])"
          :id="id"
          :key="id"
          :type="type"
          :message="message"
          @close="handleCloseNotificationItem"
        />
      </div>
    </teleport>
  </div>
</template>
