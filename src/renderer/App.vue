<template>
  <!-- TODO -->
  <!-- Create Style Template Columns that use Slots -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <!-- Allow columns to be resizable -->
  <!-- Allow columns to only be dragged on the header -->
  <!-- DONE - Only show drop-zones when the user is dragging a column -->
  <!-- DONE - DropZone Component-->
  <!-- DONE - Move all column logic & saving into a composable -->
  <!-- DONE - Allow columns to be dragged and dropped -->
  <!-- DONE - Allow columns to be ordered in their dropzone -->
  <the-sidebar />

  <column-drop-zone
    :dropZone="'left'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isLeftColumnDivEmpty"
    @drop="onColumnDrop($event, 'left')"
    @dragover="onDropZoneDragOver($event, 'left')"
  >
    <div
      v-for="(column, i) in getColumnsInDropZone('left')"
      :ref="
        (el) => {
          // Ignore this. undefined error, adding undefined check doesn't remove it
          if (el) this.leftColumnDivs[i] = el;
        }
      "
      :key="column.header"
      class="column-draggable"
      :class="
        activeDragColumnHeader === column.header ? 'column-drag-active' : ''
      "
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header, 'left')"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </column-drop-zone>

  <main class="dashboard">
    <router-view />
    <form @submit.prevent="submitForm">
      <h3>Create Project</h3>
      <input v-model.trim="inputTitle" type="text" placeholder="Title" />
      <input
        v-model.trim="inputDescription"
        type="text"
        placeholder="Description"
      />

      <button type="submit">Save</button>
    </form>
    <div v-for="project in store.projects.state.all" :key="project.title">
      <h4>{{ project.title }}</h4>
      <div>{{ project.description }}</div>
      <button @click="deleteProject(project._id)">Delete</button>
    </div>
  </main>

  <column-drop-zone
    :dropZone="'right'"
    :isDraggingActive="isDraggingActive"
    :isDropZoneEmpty="isRightColumnDivEmpty"
    @drop="onColumnDrop($event, 'right')"
    @dragover="onDropZoneDragOver($event, 'right')"
  >
    <div
      v-for="(column, i) in getColumnsInDropZone('right')"
      :ref="
        (el) => {
          // Ignore this. undefined error, adding undefined check doesn't remove it
          if (el) this.rightColumnDivs[i] = el;
        }
      "
      :key="column.header"
      class="column-draggable"
      :class="
        activeDragColumnHeader === column.header ? 'column-drag-active' : ''
      "
      draggable="true"
      @dragstart="onColumnDragStart($event, column.header, 'right')"
      @dragend="onColumnDragEnd()"
    >
      {{ column.header }}
    </div>
  </column-drop-zone>
</template>

<script setup lang="ts">
import { provide, ref, computed, watch, onBeforeUpdate, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "./store/index";
import TheSidebar from "./components/TheSidebar.vue";
import ColumnDropZone from "./components/ColumnDropZone.vue";
import useColumns from "./composables/useColumns";
import IProject from "@/interfaces/IProject";

// makes store available to every child component of App
provide("store", store);

// FORM CODE **** DELETE LATER
const inputTitle = ref<string>("");
const inputDescription = ref<string>("");

async function submitForm(): Promise<void> {
  if (inputTitle.value !== "" && inputDescription.value !== "") {
    const project = {
      title: inputTitle.value,
      description: inputDescription.value,
    };

    await store.projects.addProject(project as IProject);

    inputTitle.value = "";
    inputDescription.value = "";
  }
}

function deleteProject(id: string): void {
  store.projects.deleteProject(id);
}
// ***** END OF FORM CODE

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
} = useColumns(leftColumnDivs, rightColumnDivs);

function checkIsDropZoneEmpty(dropZone: string): boolean {
  const dropZoneColumns = sortedColumns.value.filter(
    (column) => column.dropZone === dropZone
  );
  return dropZoneColumns.length === 0 ? true : false;
}

const isLeftColumnDivEmpty = computed(() => checkIsDropZoneEmpty("left"));
const isRightColumnDivEmpty = computed(() => checkIsDropZoneEmpty("right"));

watch(() => route.path, store.setters.setActiveView);

// Needed to reset references based on vue docs
// TODO: Check to see if that's really needed
onBeforeUpdate(() => {
  leftColumnDivs.value = [];
  rightColumnDivs.value = [];
});

onMounted(async () => {
  if (store.projects !== null) {
    await store.projects.getProjects();
    console.log(store.projects.state.all);
  }
});
</script>

<style>
/* DELETE */
form {
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
}
/* END OF DELETE */

#app {
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
}

.dashboard {
  flex-grow: 1;
  margin-left: 1em;
}

.column-draggable {
  background-color: white;
  border-right: 2px black solid;
  width: 6em;
  cursor: move;
}

.column-drag-active {
  opacity: 0.5;
}
</style>
