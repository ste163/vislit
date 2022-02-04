<script setup lang="ts">
import { ref, inject, onMounted, watch, computed } from "vue";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import type { Store } from "../store";
import type { Note } from "interfaces";

const store = inject("store") as Store;
const isEditViewOpen = ref<boolean>(false);
const notes = ref<Note[]>([]);
const selectedNote = ref<Note | null>(null);

const intialFormValues = computed(() => ({
  title: selectedNote.value ? selectedNote.value.title : "",
}));

// **** Note List Logic
async function getNotes(): Promise<void> {
  try {
    const { api } = window;
    const response = (await api.send(
      "notes-get-all-by-project-id",
      store.state.activeProject?.id
    )) as Note[];
    if (!response || response instanceof Error) throw response;
    console.log(response);
    // To save a re-render for 0 notes, only set state if more than one
    if (response.length > 0) notes.value = response;
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
// **** End of Note List Logic

// **** Edit Form Logic
const validationSchema = toFormValidator(
  z.object({
    // must use z.object as formValidator requires it
    title: z.string().nonempty("Title is required."),
  })
);

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: intialFormValues, // using computed resets value properly
});

const onSubmit = handleSubmit(async ({ title }) => {
  // REASONING FOR TWO API CALLS:
  // Create/Edit Note and Create/Edit Note HTML
  // are two different pieces that are not necessarily related.
  // You can have a note without html but not html without a note.
  // You can also update the Note title but not the HTML
  // or update the HTML and not the title.
  // This sends only the needed information to the backend
  const { api } = window;
  try {
    // TODO UPDATE IF SELECTED NOTE EXISTS
    const response = await api.send("notes-add", {
      title,
      projectId: store.state.activeProject?.id,
    });

    if (!response || response instanceof Error) throw response;

    console.log(response);

    // Check for HTML content
    // If there is any, send to backend to create file
    // Show sucess notification
  } catch (error: any | Error) {
    // Show error toast
    console.error(error);
  }
});
// **** End of Edit Form Logic

onMounted(getNotes);

watch(isEditViewOpen, () => {
  // Only get Notes when we go back to List view
  if (!isEditViewOpen.value) {
    getNotes();
  }
});

watch(selectedNote, resetForm);
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
          {{ note.title }}
        </div>
      </div>
    </div>

    <!-- Edit View -->
    <div v-else>
      <button @click="isEditViewOpen = false">Back</button>
      <form @submit.prevent="onSubmit">
        <input-text
          name="title"
          type="text"
          label="Title"
          :background-color="'var(--lightGray)'"
        />
        <!-- If date modified, show that, but only when we do edit -->

        <!-- HTML editor block -->

        <!-- Need to pass in an isSubmitting for loading spinner -->
        <!-- Should say Update instead of submit -->
        <button-submit
          :is-disabled="!meta.dirty"
          :background-color-disabled="'var(--lightGray)'"
        />
      </form>
    </div>
  </div>
</template>
