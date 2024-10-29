import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(router).use(Toast).use(ElementPlus).mount("#app");
