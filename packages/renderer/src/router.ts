import { createRouter, createWebHashHistory } from "vue-router";
import Welcome from "views/welcome.vue";
import Project from "views/project.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    props: true,
  },
  {
    // For now, the currently selected project id
    // live in the app level state and isn't route based
    // may need to change later
    path: "/project",
    name: "Project",
    component: Project,
    props: true,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
