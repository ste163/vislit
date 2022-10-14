import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { expect, it } from "vitest";
import InputSearch from "./input-search.vue";

it("renders properly and emits value after debounce", async () => {
  const { emitted } = render(InputSearch);

  // initial rendering state
  expect(screen.getByRole("button")).toBeDefined();
  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  await fireEvent.update(screen.getByRole("textbox"), "Test Search Value");

  // loading rendering state
  expect(screen.queryByRole("button")).toBeNull();
  expect(screen.getByTestId("loading-spinner")).toBeDefined();
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
    "Test Search Value"
  );

  await waitFor(
    () => {
      expect(emitted()["debouncedSearch"]).toBeTruthy();
    },
    { timeout: 600 }
  );

  expect(screen.getByRole("button")).toBeDefined();
  expect(screen.queryByTestId("loading-spinner")).toBeNull();

  await fireEvent.click(screen.getByRole("button"));

  // clears search value
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
});
