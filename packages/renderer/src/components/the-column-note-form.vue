<script setup lang="ts">
import { inject, watch, computed } from "vue";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import type { PropType, ShallowRef } from "vue";
import type { Store } from "../store";
import type { Note } from "interfaces";
import type { Content, Editor } from "@tiptap/vue-3";

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

const editor = useEditor({
  content: "<p></p>",
  extensions: [StarterKit],
}) as ShallowRef<Editor>;

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

      // Check for HTML content
      // create new html file
      // Show sucess notification
    }

    // Experiment with checking html content
    const anyWrittenText = editor.value.getText();
    if (anyWrittenText) {
      const html = editor.value.getHTML();
      console.log(html);
      // save html
    }
  } catch (error: any | Error) {
    // Show error toast
    console.error(error);
  }
});

watch(() => props.selectedNote, resetForm);

// onMount that checks
// if there's a selected note
// if so, fetch note data
// but potentially do this in the watch
// as that might be more efficient
// because it's already "mounted"!!!
// probably must do in watch
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
      <div v-if="editor" class="control-container">
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          bold
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          italic
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          strike
        </button>

        <button
          type="button"
          :class="{ 'is-active': editor.isActive('paragraph') }"
          @click="editor.chain().focus().setParagraph().run()"
        >
          paragraph
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          h1
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          h2
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          h3
        </button>

        <button
          type="button"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          bullet list
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          ordered list
        </button>

        <button type="button" @click="editor.chain().focus().undo().run()">
          undo
        </button>
        <button type="button" @click="editor.chain().focus().redo().run()">
          redo
        </button>
      </div>

      <editor-content class="doc-editor p-5" :editor="editor" />

      <!-- Need to pass in an isSubmitting for loading spinner -->
      <!-- Should say Update instead of submit -->
      <button-submit
        :is-disabled="!meta.dirty"
        :background-color-disabled="'var(--lightGray)'"
      />
    </form>
  </div>
</template>

<style scoped>
.control-container {
  background-color: var(--white);
  margin-bottom: 1em;
}
.doc-editor {
  background-color: var(--white);
  overflow-y: scroll;
  height: 100%;
}
</style>
