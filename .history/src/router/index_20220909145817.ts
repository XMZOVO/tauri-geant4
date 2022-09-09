import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    component: () => import("../components/MainWindow.vue"),
    children: [
      {
        path: "",
        component: () => import("../components/Home.vue"),
      },
      {
        path: "Setting",
        component: () => import("../components/Setting.vue"),
      },
      {
        path: "Results",
        component: () => import("../components/Results.vue"),
      },
      {
        path: "Overview",
        component: () => import("../components/Overview.vue"),
      },
      // {
      //   path: "Plan",
      //   component: () => import("../components/Plan.vue"),
      // },
    ],
  },
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
});
