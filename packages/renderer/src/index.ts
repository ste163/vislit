import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import app from "./app.vue";
import welcome from "./views/view-welcome.vue";
import summary from "./views/view-summary.vue"
import writer from "./views/view-writer.vue"
import progress from "./views/view-progress.vue"
import visualization from "./views/view-visualization.vue"
import clickOutside from "./directives/click-outside";
import "./index.css";

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
    component: writer
  },
  {
    path: "/progress/:id",
    name: "Progress",
    component: progress
  },
  {
    path: "/visualization/:id",
    name: "Visualization",
    component: visualization
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

createApp(app)
  .directive("click-outside", clickOutside)
  .use(router)
  .mount("#app");
