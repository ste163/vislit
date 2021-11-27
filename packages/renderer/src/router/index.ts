import { createRouter, createWebHashHistory } from "vue-router";
import Welcome from "../views/Welcome.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/summary/:id",
    name: "Summary",
    component: () => import("/@/views/Summary.vue"),
  },
  {
    path: "/writer/:id",
    name: "Writer",
    component: () => import("/@/views/Writer.vue"),
  },
  {
    path: "/progress/:id",
    name: "Progress",
    component: () => import("/@/views/Progress.vue"),
  },
  {
    path: "/visualization/:id",
    name: "Visualization",
    component: () => import("/@/views/Visualization.vue"),
  },
  {
    path: "/thesaurus",
    name: "Thesaurus",
    component: () => import("/@/views/Thesaurus.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
