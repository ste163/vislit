import { cleanup, render, screen, fireEvent } from "@testing-library/vue";
import { afterEach, expect, it, vi } from "vitest";
import TheProjectForm from "./the-project-form.vue";
import type { Type } from "interfaces";

afterEach(() => cleanup());

const MOCK_TYPES: Type[] = [
  { id: "1", value: "First Type" },
  { id: "2", value: "Second Type" },
];

const renderProjectForm = () => {
  const utils = render(TheProjectForm, {
    props: {
      types: MOCK_TYPES,
    },
  });

  // required type assertion to get .value
  const nameInput: HTMLInputElement = screen.getByRole("textbox", {
    name: "Title",
  });
  const descriptionInput: HTMLInputElement = screen.getByRole("textbox", {
    name: "Description (optional)",
  });
  // to get the input working with vee-validate, the select state is on the label
  const selectValue: string | null = screen
    .getByText("Type")
    .getAttribute("fieldvalue");

  const submitButton = screen.getByRole("button", { name: "Create" });

  return {
    ...utils,
    nameInput,
    selectValue,
    descriptionInput,
    submitButton,
    fillForm: async ({ fillOptionalFields = true }) => {
      await fireEvent.update(nameInput, "New Story");
      expect(nameInput.value).toBe("New Story");
      await fireEvent.update(screen.getAllByRole("option")[1]);
      expect(screen.getByText("Type").getAttribute("fieldvalue")).toBe("1");
      if (fillOptionalFields) {
        await fireEvent.update(descriptionInput, "This is my description");
        expect(descriptionInput.value).toBe("This is my description");
      }
    },
  };
};

it("if no project passed in, show empty create project form. Error messages display", async () => {
  const { nameInput, selectValue, descriptionInput } = renderProjectForm();
  // no pre-populated data
  expect(nameInput.value).toBe("");
  expect(selectValue).toBe("");
  expect(descriptionInput.value).toBe("");
  // NOTE:
  // trying to test using submit button never worked
  // testing error message state by adding and removing required data
  await fireEvent.update(nameInput, "Test");
  await fireEvent.update(nameInput, "");
  await fireEvent.update(screen.getAllByRole("option")[1]);
  expect(screen.getByText("Type").getAttribute("fieldvalue")).toBe("1");
  await fireEvent.update(screen.getAllByRole("option")[0]);
  expect(screen.getByText("Type").getAttribute("fieldvalue")).toBe("");
  await screen.findByText("Type is required.");
  await screen.findByText("Title is required.");
});

// TODO WITH EDIT FEATURE
it.skip("if project passed in, show pre-populated fields", () => {});

it.skip("Failing to send form data shows error", () => {
  // how to change select:
  // await fireEvent.update(screen.getAllByRole("option")[1]);
  // expect(selectLabel.getAttribute("fieldvalue")).toBe("1");
  //
  // emitted error dialog event
});

// TODO WITH EDIT FEATURE
it.skip("Can edit and submit a passed in form", () => {});

it.skip("Entering only required fields submits form", () => {
  // emitted submit event
});

it("Entering all fields submits form", async () => {
  // TODO:
  // try to setup an app level mock for the api
  // idk if this mock is working, I doubt it though.
  // needs to follow more of this setup:
  // https://vitest.dev/guide/mocking.html#modules
  vi.mock("api", () => {
    const send = vi.fn(() => ({
      id: "123",
    }));
    return { send };
  });
  const { fillForm } = renderProjectForm();
  await fillForm({ fillOptionalFields: true });
  // TODO should emit the completed form
});
