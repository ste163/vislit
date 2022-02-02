<script setup lang="ts">
// Do the form first and get that saving, then the list view
// Then depending on how large it is, move to separate components
import { ref } from "vue";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";

const isEditViewOpen = ref<boolean>(false);

const validationSchema = toFormValidator(
  z.object({
    // must use z.object as formValidator requires it
    title: z.string().nonempty("Title is required."),
  })
);

const initialFormValues = {
  title: "",
};

// TODO: ensure validation only occurs after the from is touched,
// not when we render the form/mount form
const { handleSubmit, meta } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async ({ title }, { resetForm }) => {
  console.log(title);

  // TODO:
  // Send title to notes create api
  // await for the created id
  // if there was html content added
  // create the htmlData object
  // send to api to create note file
  // show success notification
  // REASONING:
  // Creating a Note and Creating HTML
  // are two different pieces that are not necessarily related
  // You can have a note without html but not html without a note.
  // You can also Update the Note title but not the HTML
  // or update the HTML and not the title.
  // Having them separate will work better for the edit
  // and be logically separated enough for the create
});

// Note interface
// id?: string;
// projectId: string;
// title: string;
// dateCreated?: Date | string;
// dateModified?: Date | string;
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
      <button @click="isEditViewOpen = true">Create Note</button>

      <div>
        <p>All Saved Notes</p>
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
        <button-submit
          :is-disabled="!meta.dirty"
          :background-color-disabled="'var(--lightGray)'"
        />
      </form>
    </div>
  </div>
</template>
