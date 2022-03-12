import { cleanup, render, screen } from "@testing-library/vue";
import { it, expect, afterEach } from "vitest";
import Welcome from "./welcome.vue";

afterEach(() => cleanup());

it("renders loading state while isLoading is true", () => {
  render(Welcome, {
    props: {
      isLoading: true,
    },
  });
  expect(screen.getByTestId("loading-welcome")).toBeTruthy();
});

it("renders page when loaded and calls import data, change save location, and create project when buttons clicked", () => {
  render(Welcome, {
    props: {
      isLoading: false,
    },
  });
  // not loading
  expect(screen.queryByTestId("loading-welcome")).toBeNull();

  // all headings exist
  const headings = screen.getAllByRole("heading");
  expect(headings[0].textContent).toBe("Welcome to Vislit!");
  expect(headings[1].textContent).toBe("Import previous Vislit Data");
  expect(headings[2].textContent).toBe(
    "Choose a save location for your Vislit Data"
  );
  expect(headings[3].textContent).toBe("Create a Project");

  // clicking the import Vislit Data button calls ipcSend

  // default save data location is called and renders
  // clicking the Change Save Location button calls ipcSend

  // clicking create a project calls onCreateProject (either a passed in function), one from state, or elsewhere
});
