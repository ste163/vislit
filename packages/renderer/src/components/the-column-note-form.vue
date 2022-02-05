<script setup lang="ts">
import { inject, watch, computed } from "vue";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import type { PropType } from "vue";
import type { Store } from "../store";
import type { Note } from "interfaces";

const store = inject("store") as Store;

const props = defineProps({
  selectedNote: {
    type: Object as PropType<Note | null>,
    required: false,
    default: null,
  },
});

const intialFormValues = computed(() => ({
  title: props.selectedNote ? props.selectedNote.title : "",
}));

const emit = defineEmits(["delete", "back"]);

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
    if (props.selectedNote) {
      const updatedNote: Note = {
        id: props.selectedNote.id,
        projectId: props.selectedNote.projectId,
        title,
        dateCreated: props.selectedNote.dateCreated,
        dateModified: props.selectedNote.dateModified,
      };
      const response = await api.send("notes-update", updatedNote);
      if (!response || response instanceof Error) throw response;

      // Check for HTML content,
      // if any changes, update!
      // then show success notification
    } else {
      const response = await api.send("notes-add", {
        title,
        projectId: store.state.activeProject?.id,
      });
      if (!response || response instanceof Error) throw response;
    }

    // Check for HTML content
    // If there is any, send to backend to create file
    // Show sucess notification
  } catch (error: any | Error) {
    // Show error toast
    console.error(error);
  }
});

watch(() => props.selectedNote, resetForm);
</script>

<template>
  <div>
    <button @click="() => emit('back')">Back</button>
    <button
      v-if="selectedNote?.id"
      @click="
        (event) => {
          emit('delete', event, selectedNote?.id);
          emit('back');
        }
      "
    >
      Delete
    </button>
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
</template>
