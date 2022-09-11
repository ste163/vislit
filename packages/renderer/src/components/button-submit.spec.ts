import { cleanup, render, screen } from "@testing-library/vue";
import { afterEach, expect, it } from "vitest";
import ButtonSubmit from "./button-submit.vue";

afterEach(() => cleanup());

it("if isSubmitting passed in, spinner renders", () => {
  render(ButtonSubmit, {
    props: {
      isSubmitting: true,
    },
  });
  expect(screen.getByRole("status"));
});

it("if isSubmitting is false,  spinner isn't rendered", () => {
  render(ButtonSubmit, {
    props: {
      isSubmitting: false,
    },
  });
  expect(screen.queryByRole("status")).toBeNull();
});
