<template>
  <the-sidebar />

  <column-drop-zone
    class="drop-zone-left"
    :dropZone="'left'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isLeftColumnDivEmpty"
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
          :column="column"
          :class="
            activeDragColumnHeader === column.header ? 'column-drag-active' : ''
          "
          @dragstart="onColumnDragStart($event, column.header, 'left')"
          @dragend="onColumnDragEnd()"
        />
      </div>
    </transition-group>
  </column-drop-zone>

  <main class="dashboard">
    <router-view />
  </main>

  <column-drop-zone
    class="drop-zone-right"
    :dropZone="'right'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isRightColumnDivEmpty"
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
          :column="column"
          :class="
            activeDragColumnHeader === column.header ? 'column-drag-active' : ''
          "
          @dragstart="onColumnDragStart($event, column.header, 'right')"
          @dragend="onColumnDragEnd()"
        />
      </div>
    </transition-group>
  </column-drop-zone>
</template>

<script setup lang="ts">
import { provide, ref, computed, watch, onBeforeUpdate, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "./store/index";
import TheSidebar from "./components/TheSidebar.vue";
import ColumnDropZone from "./components/ColumnDropZone.vue";
import ColumnContainer from "./components/ColumnContainer.vue";
import useColumns from "./composables/useColumns";

provide("store", store); // Makes store available to every child component

const route = useRoute();

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

watch(() => route.path, store.application.setActiveView);

// Needed to reset references based on vue docs
// TODO: Check to see if that's really needed
onBeforeUpdate(() => {
  leftColumnDivs.value = [];
  rightColumnDivs.value = [];
});

onMounted(async () => {
  if (store.projects !== null) {
    await store.projects.getProjects();
  }
});
</script>

<style>
#app {
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
}

.dashboard {
  flex-grow: 1;
  margin-left: 1em;
}

.column-drag-active {
  opacity: 0.5;
}

/* Open columns - lines & drop-shadow */
/*
Right drop-zone is different due to CSS bug
where a blue 1px line always showed, except when border applied
to the .column-container. Left drop-zone was unaffected. - 09/20/2021
*/
.drop-zone-left .drop-zone-column-item:last-child {
  box-shadow: #00000005 15px 0px 15px;
  border: none;
}

.drop-zone-left > .drop-zone-column-item {
  border-right: solid 3px var(--white);
}

.drop-zone-right .drop-zone-column-item:first-child {
  box-shadow: #00000005 -10px 0px 15px;
  border: none;
}

.drop-zone-right .drop-zone-column-item:first-child > .column-container {
  border: none;
}

.drop-zone-right > .drop-zone-column-item > .column-container {
  border-left: solid 3px var(--white);
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
