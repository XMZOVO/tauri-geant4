import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { Router } from "./router";
import { createPinia } from "pinia";
import "flowbite";

const pinia = createPinia();

createApp(App).use(pinia).use(Router).mount("#app");
