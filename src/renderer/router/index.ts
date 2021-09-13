import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Summary from "../views/Summary.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Summary",
    component: Summary,
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
