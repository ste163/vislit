import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Summary from "../views/Summary.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Summary",
    component: Summary,
  },
  {
    path: "/progress",
    name: "Progress",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Progress.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
