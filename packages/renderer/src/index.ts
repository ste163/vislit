import { createApp } from "vue";
import app from "./app.vue";
import router from "/@/router/index";
import clickOutside from "./directives/click-outside";
import "./index.css";

createApp(app)
  .directive("click-outside", clickOutside)
  .use(router)
  .mount("#app");
