import { cleanup, render, screen } from "@testing-library/vue";
import { it, expect, afterEach } from "vitest";
import TheSidebar from "./the-sidebar.vue";

afterEach(() => cleanup());

// Potentially move props out into separate file that can be imported for both component + tests

function renderSidebar(props: any) {
  render(TheSidebar, { props });

  return {
    queryIsSidebarLoading: () => screen.queryByTestId("sidebar-loading"),
    queryIsSidebarLoaded: () => screen.queryByText("Views"), // unable to get queryByRole to work for the Views text
    getAllButtons: () => screen.getAllByRole("button"),
  };
}

it("renders loading state while isLoading is true", () => {
  const { queryIsSidebarLoading, queryIsSidebarLoaded } = renderSidebar({
    isLoading: true,
    isDisabled: true,
  });
  expect(queryIsSidebarLoading()).toBeTruthy();
  expect(queryIsSidebarLoaded()).toBeNull();
});

it("renders disabled sidebar if not loading", async () => {
  const { queryIsSidebarLoading, queryIsSidebarLoaded, getAllButtons } =
    renderSidebar({
      isLoading: false,
      isDisabled: true,
    });
  expect(queryIsSidebarLoading()).toBeNull();
  expect(queryIsSidebarLoaded()).toBeTruthy();

  const buttons = getAllButtons();

  buttons.forEach((button) => {
    const attributeName = button.attributes["1"].name;
    const attributeValue = button.attributes["1"].value;
    expect(attributeName).toBe("disabled");
    expect(attributeValue).toBe("true");
  });
});

it.skip("clicking sidebar view buttons routes to views and clicking column buttons emits events", () => {
  // setup button click mocks -> event emit mocking?
  // setup router mock? Or history mock?
  // render
  // for all buttons, they are not disabled
  // can click each button and get correct assumption
});
