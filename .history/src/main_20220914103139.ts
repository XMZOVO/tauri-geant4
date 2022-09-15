import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { Router } from "./router";
import { createPinia } from "pinia";
import X3D from "x_ite";

const pinia = createPinia();

createApp(App).use(pinia).use(Router).mount("#app");
