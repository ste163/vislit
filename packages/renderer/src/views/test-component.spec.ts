import { render } from "@testing-library/vue";
import { it, expect } from "vitest";
import TestComponent from "./test-component.vue";

it("should render if its setup right", () => {
  const { getByRole } = render(TestComponent);
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const heading = getByRole("heading");
  expect(heading.textContent).toBe("I rendered");
});
