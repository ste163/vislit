import { cleanup, render, screen } from "@testing-library/vue";
import { it, expect, afterEach } from "vitest";
import Welcome from "./welcome.vue";

afterEach(() => cleanup());

it.skip("renders loading state while isLoading is true", () => {
  render(Welcome);
  const heading = screen.getByRole("heading");
  expect(heading.textContent).toBe("Welcome");
});
