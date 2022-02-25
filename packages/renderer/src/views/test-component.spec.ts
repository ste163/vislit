import { it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import TestComponent from "test-component.vue";

it("should render if its setup right", () => {
  render(TestComponent);
  const test = screen.getByText("I rendered!");
  expect(test).toBeFalsy();
});
