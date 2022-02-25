// Possible test scenarios:
// Might be emitting events on click (to open columns)
// Router routes properly when the view buttons clicked
// and that the sidebar is disabled based on passed in props (ie, if there is no activeProject or projectId)
// passed in, disable the sidebar
import { render, screen } from "@testing-library/vue";
import { it, expect } from "vitest";
import TheSidebar from "./the-sidebar.vue";

it("should render if its setup right", () => {
  render(TheSidebar);
  const nav = screen.getByRole("navigation");
  expect(nav.textContent).toBe("Sidebar Nav");
});
