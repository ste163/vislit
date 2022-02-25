import { createRouter, createWebHashHistory } from "vue-router";
import welcome from "./views/view-welcome.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: welcome,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
