import { createRouter, createWebHashHistory } from "vue-router";
import { Welcome, Project } from "views";

export const URL_PATHS = {
  Home: "/",
  Project: "/project",
  Writer: "/writer",
  Progress: "/progress",
  Visualizations: "/visualizations",
} as const;

const routes = [
  {
    path: URL_PATHS.Home,
    name: "Welcome",
    component: Welcome,
    props: true,
  },
  {
    // For now, the currently selected project id
    // live in the app level state and isn't route based
    // may need to change later
    path: URL_PATHS.Project,
    name: "Project",
    component: Project,
    props: true,
  },
  // TODO: use real view components; placeholders now to resolve router warnings
  {
    path: URL_PATHS.Writer,
    name: "Writer",
    component: Welcome,
    props: true,
  },
  {
    path: URL_PATHS.Progress,
    name: "Progress",
    component: Welcome,
    props: true,
  },
  {
    path: URL_PATHS.Visualizations,
    name: "Visualizations",
    component: Welcome,
    props: true,
  },
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
