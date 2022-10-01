import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { it, expect, afterEach } from "vitest";
import TheSidebar from "./the-sidebar.vue";
import { router } from "router";

afterEach(() => cleanup());

function renderSidebar(props: any) {
  const utils = render(TheSidebar, { global: { plugins: [router] }, props });

  return {
    ...utils,
    queryIsSidebarLoading: () => screen.queryByTestId("loading-sidebar"),
    queryIsSidebarLoaded: () => screen.queryByText("Views"),
  };
}

it("renders loading state while isLoading is true", () => {
  const { queryIsSidebarLoading, queryIsSidebarLoaded } = renderSidebar({
    isLoading: true,
    isDisabled: true,
    isProjectColumnActive: false,
  });
  expect(queryIsSidebarLoading()).toBeTruthy();
  expect(queryIsSidebarLoaded()).toBeNull();
});

it("renders disabled sidebar if not loading", async () => {
  const { queryIsSidebarLoading, queryIsSidebarLoaded } = renderSidebar({
    isLoading: false,
    isDisabled: true,
    isProjectColumnActive: false,
  });
  expect(queryIsSidebarLoading()).toBeNull();
  expect(queryIsSidebarLoaded()).toBeTruthy();
  const links = screen.getAllByRole("link");
  links.forEach((link) => {
    expect(link.attributes["1"].value).toBe(
      "sidebar-item sidebar-item-disabled"
    );
  });
});

it("clicking the column buttons emits their events", async () => {
  const { emitted } = renderSidebar({
    isLoading: false,
    isDisabled: true,
    isProjectColumnActive: false,
  });
  await fireEvent.click(screen.getByText("Projects"));
  expect(emitted()["clickProjectsColumn"]).toBeTruthy();
  // TODO:
  // click notes button
  // emits open note column event
});
