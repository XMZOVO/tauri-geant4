import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { Router } from "./router";
import { createPinia } from "pinia";
import HighchartsVue from "highcharts-vue";

const pinia = createPinia();

createApp(App).use(pinia).use(Router).mount("#app");
