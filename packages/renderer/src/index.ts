import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/router/index';
import clickOutside from "./directives/clickOutside";
import "./index.css";

createApp(App)
	.directive("click-outside", clickOutside)
	.use(router)
	.mount('#app');
