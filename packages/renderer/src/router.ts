import { createRouter, createWebHashHistory } from "vue-router";
import Welcome from "views/welcome.vue";

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    props: true,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
