<script setup lang="ts">
import { provide, ref, computed, watch, onBeforeUpdate, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "./store/index";
import TheSidebar from "./components/TheSidebar.vue";
import ColumnDropZone from "./components/ColumnDropZone.vue";
import ColumnContainer from "./components/ColumnContainer.vue";
import useColumns from "./composables/use-columns";

provide("store", store); // Makes store available to every child component

const router = useRouter();
const route = useRoute();

const dashTransitionKey = ref<number>(0);
const leftColumnDivs = ref<Array<HTMLDivElement>>([]);
const rightColumnDivs = ref<Array<HTMLDivElement>>([]);

const {
  sortedColumns,
  isDraggingActive,
  activeDragColumnHeader,
  getColumnsInDropZone,
  onColumnDragStart,
  onColumnDragEnd,
  onDropZoneDragOver,
  onColumnDrop,
} = useColumns(store, leftColumnDivs, rightColumnDivs);

function checkIsDropZoneEmpty(dropZone: string): boolean {
  const dropZoneColumns = sortedColumns.value.filter(
    (column) => column.dropZone === dropZone
  );
  return dropZoneColumns.length === 0 ? true : false;
}

function setDropZoneRefs(element: unknown | null, dropZone: string): void {
  if (element !== null) {
    dropZone === "left"
      ? leftColumnDivs.value.push(element as HTMLDivElement)
      : rightColumnDivs.value.push(element as HTMLDivElement);
  }
}

const isLeftColumnDivEmpty = computed(() => checkIsDropZoneEmpty("left"));
const isRightColumnDivEmpty = computed(() => checkIsDropZoneEmpty("right"));

function updateStateOnRouteChange(route: string): void {
  store.application.setActiveView(route);
  ++dashTransitionKey.value; // needed to force re-rendering of component to ensure animation is always triggered
}

watch(() => route.path, updateStateOnRouteChange);

onMounted(async () => {
  if (store.projects !== null) {
    await store.projects.getProjects(); // doesn't need to be wrapped in try/catch because getProjects will trigger an error if there is one

    if (store.projects.state.all.length > 0) {
      // check local storage for last selected project
      // OR set most recent as active -> need to add that step
      store.projects.setActiveProject(store.projects.state.all[0]);
      // check local storage for last visited route
      router.push(`/summary/${store.projects.state.all[0].id}`);
    } else {
      router.push("/"); // sends user to Welcome screen, as they have no data
    }
  }

  await store.application.getAllTypes();
});

// Needed to reset references based on vue docs
// TODO: Check to see if that's really needed
onBeforeUpdate(() => {
  leftColumnDivs.value = [];
  rightColumnDivs.value = [];
});
</script>

<template>
  <the-sidebar />

  <div class="dashboard">
    <column-drop-zone
      class="drop-zone-left"
      :drop-zone="'left'"
      :is-dragging-active="isDraggingActive"
      :is-drop-zone-empty="isLeftColumnDivEmpty"
      @drop="onColumnDrop($event, 'left')"
      @dragover="onDropZoneDragOver($event, 'left')"
    >
      <transition-group name="drop-zone-column-list" mode="in-out">
        <!-- Need div wrapper; refs can't be on component instances, only actuall dom nodes-->
        <div
          v-for="column in getColumnsInDropZone('left')"
          :ref="(el) => setDropZoneRefs(el, 'left')"
          :key="column.header"
          class="drop-zone-column-item"
        >
          <column-container
            :drop-zone="'left'"
            :column="column"
            :class="
              activeDragColumnHeader === column.header
                ? 'column-drag-active'
                : ''
            "
            @dragstart="onColumnDragStart($event, column.header, 'left')"
            @dragend="onColumnDragEnd()"
          />
        </div>
      </transition-group>
    </column-drop-zone>

    <main class="active-view">
      <router-view v-slot="{ Component }">
        <transition name="dash-navigation">
          <div :key="dashTransitionKey">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>

    <column-drop-zone
      class="drop-zone-right"
      :drop-zone="'right'"
      :is-dragging-active="isDraggingActive"
      :is-drop-zone-empty="isRightColumnDivEmpty"
      @drop="onColumnDrop($event, 'right')"
      @dragover="onDropZoneDragOver($event, 'right')"
    >
      <transition-group name="drop-zone-column-list" mode="in-out">
        <div
          v-for="column in getColumnsInDropZone('right')"
          :ref="(el) => setDropZoneRefs(el, 'right')"
          :key="column.header"
          class="drop-zone-column-item"
        >
          <column-container
            :drop-zone="'right'"
            :column="column"
            :class="
              activeDragColumnHeader === column.header
                ? 'column-drag-active'
                : ''
            "
            @dragstart="onColumnDragStart($event, column.header, 'right')"
            @dragend="onColumnDragEnd()"
          />
        </div>
      </transition-group>
    </column-drop-zone>
  </div>
</template>

<style>
#app {
  @apply flex
  flex-nowrap
  flex-row
  h-screen;
}

.dashboard {
  @apply flex
  flex-nowrap
  flex-grow
  overflow-x-auto;
}

.active-view {
  /*
  TODO:
    user-select: none
    when either
    dragging columns OR resizing.
  */
  @apply flex
  flex-col
  flex-nowrap
  flex-grow
  items-center
  m-10;
}

.column-drag-active {
  @apply opacity-50;
}

/* Router animations */
.dash-navigation-enter-from,
.dash-navigation-leave-to {
  opacity: 0;
}

.dash-navigation-leave-active,
.dash-navigation-enter-active {
  transition: all 0.25s;
  position: absolute;
}

/* Open column drop-shadow */
.drop-zone-left .drop-zone-column-item:last-child {
  box-shadow: #00000005 15px 0px 15px;
}

.drop-zone-right .drop-zone-column-item:first-child {
  box-shadow: #00000005 -10px 0px 15px;
}

/* Column animations */
.drop-zone-column-item {
  transition: all 0.25s;
  display: inline-block;
}

.drop-zone-column-list-enter-from,
.drop-zone-column-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.drop-zone-column-list-leave-active {
  position: absolute;
}
</style>
