<script setup lang="ts">
import { ref, inject, onMounted, watch } from "vue";
import type { Store } from "../store";
import type { Note } from "interfaces";
import TheColumnNoteForm from "./the-column-note-form.vue";

const store = inject("store") as Store;
const isEditViewOpen = ref<boolean>(false);
const notes = ref<Note[]>([]);
const selectedNote = ref<Note | null>(null);

async function getNotes(): Promise<void> {
  try {
    const { api } = window;
    const response = (await api.send(
      "notes-get-all-by-project-id",
      store.state.activeProject?.id
    )) as Note[];
    if (!response || response instanceof Error) throw response;
    notes.value = response;
  } catch (error: any | Error) {
    console.error(error);
  }
}

function onCreateNoteClick(): void {
  selectedNote.value = null;
  isEditViewOpen.value = true;
}

async function setSelectedNote(noteId: string): Promise<void> {
  // Include HTML for this in fetch as this will setup for form
  try {
    const { api } = window;
    const response = (await api.send("notes-get-by-id", noteId)) as Note;
    if (!response || response instanceof Error) throw response;
    selectedNote.value = response;
    isEditViewOpen.value = true;
  } catch (error: any | Error) {
    console.error(error);
  }
}

async function onDeleteClick(event: MouseEvent, id: string): Promise<void> {
  // TODO: Replace with a modal opener
  // This function will live in the-column-note
  // and will be used on event delete clicks from List and Form
  event.stopPropagation();
  try {
    const { api } = window;
    const response = await api.send("notes-delete", id);
    if (!response || response instanceof Error) throw response;
    await getNotes();
    // success notification
  } catch (error: any | Error) {
    // error notification
    console.error(error);
  }
}

onMounted(getNotes);

watch(isEditViewOpen, () => {
  // Only get Notes when we go back to List view
  if (!isEditViewOpen.value) getNotes();
});
</script>

<template>
  <!-- 
    Two Column States Only:
    1. List View
    2. Edit View
  -->
  <div>
    <!-- List View -->
    <div v-if="!isEditViewOpen">
      <button @click="onCreateNoteClick">Create Note</button>
      <div>
        <div
          v-for="note in notes"
          :key="note.id"
          @click="setSelectedNote(note.id!)"
        >
          <span> {{ note.title }}</span>
          <button @click="(e) => onDeleteClick(e, note.id!)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit View -->
    <the-column-note-form
      v-else
      :selected-note="selectedNote"
      @back="() => (isEditViewOpen = false)"
      @delete="(event: MouseEvent, id: string) => onDeleteClick(event, id)"
    />
  </div>
</template>
