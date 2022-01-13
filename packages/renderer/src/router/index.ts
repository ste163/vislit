import { createRouter, createWebHashHistory } from "vue-router";
import welcome from "../views/welcome.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: welcome,
  },
  {
    path: "/summary/:id",
    name: "Summary",
    component: () => import("../views/summary.vue"),
  },
  {
    path: "/writer/:id",
    name: "Writer",
    component: () => import("../views/writer.vue"),
  },
  {
    path: "/progress/:id",
    name: "Progress",
    component: () => import("../views/progress.vue"),
  },
  {
    path: "/visualization/:id",
    name: "Visualization",
    component: () => import("../views/visualization.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
