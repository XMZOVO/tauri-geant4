import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../pages/Main.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/Home.vue"),
      },
      {
        path: "Setting",
        component: () => import("../pages/Settings.vue"),
      },
      {
        path: "Results",
        component: () => import("../pages/Results.vue"),
      },
      {
        path: "Overview",
        component: () => import("../pages/Overview.vue"),
      },
      // {
      //   path: "Test",
      //   component: () => import("../pages/Test.vue"),
      // },
    ],
  },
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
});
