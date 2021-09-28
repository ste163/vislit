import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Welcome from "../views/Welcome.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/summary",
    name: "Summary",
    component: () =>
      import(/* webpackChunkName: "summary" */ "../views/Summary.vue"),
  },
  {
    path: "/writer",
    name: "Writer",
    component: () =>
      import(/* webpackChunkName: "writer" */ "../views/Writer.vue"),
  },
  {
    path: "/progress",
    name: "Progress",
    component: () =>
      import(/* webpackChunkName: "progress" */ "../views/Progress.vue"),
  },
  {
    path: "/visualization",
    name: "Visualization",
    component: () =>
      import(
        /* webpackChunkName: "visualization" */ "../views/Visualization.vue"
      ),
  },
  {
    path: "/thesaurus",
    name: "Thesaurus",
    component: () =>
      import(/* webpackChunkName: "thesaurus" */ "../views/Thesaurus.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
