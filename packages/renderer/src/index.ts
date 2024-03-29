import { createApp } from "vue";
import app from "./app.vue";
import router from "./router";
import { clickOutside } from "directives";
import "./index.css";

createApp(app)
  .directive("click-outside", clickOutside)
  .use(router)
  .mount("#app");
