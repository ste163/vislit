import { render } from "@testing-library/vue";
import { it, expect } from "vitest";
import ViewTest from "./view-test.vue";

it("should render if its setup right", () => {
  const { getByRole } = render(ViewTest);
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const heading = getByRole("heading");
  expect(heading.textContent).toBe("I rendered");
});
