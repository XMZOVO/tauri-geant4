import { createApp } from "vue";
import App from "./App.vue";
import { Router } from "./router";

import "uno.css";

createApp(App).use(Router).mount("#app");
