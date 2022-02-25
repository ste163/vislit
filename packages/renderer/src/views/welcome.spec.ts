import { render, screen } from "@testing-library/vue";
import { it, expect } from "vitest";
import Welcome from "./welcome.vue";

it("should render if its setup right", () => {
  render(Welcome);
  const heading = screen.getByRole("heading");
  expect(heading.textContent).toBe("Welcome");
});
