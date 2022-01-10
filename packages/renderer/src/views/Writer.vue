<script setup lang="ts">
import type { ShallowRef } from "vue";
import { inject, onMounted } from "vue";
import type { Content, Editor } from "@tiptap/vue-3";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import type { Store } from "../store";

const store = inject("store") as Store;

const editor = useEditor({
  content: "<h1></h1>",
  extensions: [StarterKit],
}) as ShallowRef<Editor>;

async function onSubmit(): Promise<void> {
  try {
    const html = editor.value.getHTML();
    const { api } = window;
    const data = {
      id: store.projects.state.active?.id,
      html,
      type: "documents",
      createdAt: new Date(),
    };
    const response = await api.send("writer-save", data);
    // check if error
    // or true
    // display success or error banner
    console.log(response);
  } catch (error: any) {
    console.error(error);
  }
}

onMounted(async () => {
  // TODO:
  // fetch array of all file names to display on frontend for selecting
  // once one is selected, make another call to fetch that html data
  // then display
  try {
    const { api } = window;
    const mostRecentDocument = (await api.send(
      "writer-get-most-recent",
      store.projects.state.active?.id
    )) as Content;
    editor.value.commands.setContent(mostRecentDocument);
  } catch (error: any | Error) {
    console.error(error);
  }
});
</script>

<template>
  <div v-if="editor" class="control-container">
    <button
      :class="{ 'is-active': editor.isActive('bold') }"
      @click="editor.chain().focus().toggleBold().run()"
    >
      bold
    </button>
    <button
      :class="{ 'is-active': editor.isActive('italic') }"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      italic
    </button>
    <button
      :class="{ 'is-active': editor.isActive('strike') }"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      strike
    </button>
    <button @click="editor.chain().focus().clearNodes().run()">
      clear nodes
    </button>
    <button
      :class="{ 'is-active': editor.isActive('paragraph') }"
      @click="editor.chain().focus().setParagraph().run()"
    >
      paragraph
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      h1
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      h2
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      h3
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
    >
      h4
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
    >
      h5
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
    >
      h6
    </button>
    <button
      :class="{ 'is-active': editor.isActive('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      bullet list
    </button>
    <button
      :class="{ 'is-active': editor.isActive('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      ordered list
    </button>
    <button @click="editor.chain().focus().setHorizontalRule().run()">
      horizontal rule
    </button>
    <button @click="editor.chain().focus().setHardBreak().run()">
      hard break
    </button>
    <button @click="editor.chain().focus().undo().run()">undo</button>
    <button @click="editor.chain().focus().redo().run()">redo</button>
  </div>

  <editor-content class="doc-editor p-5" :editor="editor" />

  <button @click="onSubmit">Save Content</button>
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
