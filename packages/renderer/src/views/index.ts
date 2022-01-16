import { createRouter, createWebHashHistory } from "vue-router";
import welcome from "./view-welcome.vue";
import summary from "./view-summary.vue";
import writer from "./view-writer.vue";
import progress from "./view-progress.vue";
import visualization from "./view-visualization.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: welcome,
  },
  {
    path: "/summary/:id",
    name: "Summary",
    component: summary,
  },
  {
    path: "/writer/:id",
    name: "Writer",
    component: writer,
  },
  {
    path: "/progress/:id",
    name: "Progress",
    component: progress,
  },
  {
    path: "/visualization/:id",
    name: "Visualization",
    component: visualization,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router