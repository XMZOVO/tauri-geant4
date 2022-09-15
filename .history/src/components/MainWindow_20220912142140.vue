<script lang="ts" setup>
import { ref } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { defineStore } from "pinia";

const router = useRouter();
const isActive = ref(0);
const theme = ref("light");
const lightCss = ref("bg-base-100 shadow-lg");
const darkCss = ref("");

const navigatioBarItems = ref([
  {
    name: "主页",
    svg: [
      "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    ],
    path: "/",
  },
  {
    name: "概览",
    svg: [
      "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z",
      "M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z",
    ],
    path: "/Overview",
  },
  {
    name: "结果",
    svg: [
      "M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z",
    ],
    path: "Results",
  },
  {
    name: "设置",
    svg: [
      "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    ],
    path: "Setting",
  },
]);

onBeforeRouteUpdate((to, from) => {
  if (to.fullPath == "/Overview") {
    isActive.value = 1;
  }
});

const homePageClick = () => {
  isActive.value = 0;
  router.push({ path: "/" });
};

const navigatioBarItemsClick = (index: number) => {
  isActive.value = 0;
  router.push({ path: navigatioBarItems.value[index].path });
};

const changeToDark = () => {
  theme.value = "dark";
  darkCss.value = "bg-base-100 shadow-lg";
  lightCss.value = "";
};

const changeToLight = () => {
  theme.value = "light";
  lightCss.value = "bg-base-100 shadow-lg";
  darkCss.value = "";
};

const planClick = () => {
  isActive.value = 4;
  router.push({ path: "/Plan" });
};

function setIsActiveIndex(index: number) {
  isActive.value = index;
  alert("w");
}
</script>

<template>
  <div :data-theme="theme" class="drawer-mobile drawer h-screen">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <!-- <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
        >Open drawer</label
      > -->
      <router-view> </router-view>
    </div>
    <div class="drawer-side border-r border-solid border-base-300">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul
        class="menu w-80 justify-between overflow-y-auto bg-base-100 p-4 text-base-content"
      >
        <!-- Sidebar content here -->
        <div>
          <!-- App标题 -->
          <div class="hidden items-center gap-2 pb-10 lg:flex">
            <div
              class="hidden items-center py-2 px-4 font-bold md:text-3xl lg:flex"
            >
              <img src="../assets/icon.png" class="h-10 w-10" />
              <div class="inline-flex md:text-3xl">
                <span class="text-cyan-500">Tauri</span>
                <span class="text-yellow-500">App</span>
              </div>
            </div>
            <div class="font-semibold text-base-content">V0.0.1</div>
          </div>
          <!-- App标题 -->
          <!-- 导航栏 -->
          <li v-for="(item, index) in navigatioBarItems">
            <a
              :class="{ active: isActive == index }"
              @click="navigatioBarItemsClick(index)"
            >
              <span class="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    v-for="svg in item.svg"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :d="svg"
                  />
                </svg>
              </span>
              <span class="flex-1">{{ item.name }}</span></a
            >
          </li>

          <!-- <li>
            <a :class="{ active: isActive == 4 }" @click="planClick">
              <span class="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span class="flex-1">规划</span>
            </a>
          </li> -->
          <!-- 导航栏 -->
        </div>
        <div class="flex flex-col">
          <div class="divider"></div>

          <!-- 主题切换 -->
          <div class="mb-5 rounded-full bg-base-200">
            <div class="flex p-1">
              <div
                :class="
                  'flex w-1/2 cursor-pointer justify-center gap-3  rounded-full px-5 py-1 ' +
                  lightCss
                "
                @click="changeToLight"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>

                <div>Light</div>
              </div>
              <div
                :class="
                  'flex w-1/2 cursor-pointer justify-center gap-3 rounded-full px-5 py-1 ' +
                  darkCss
                "
                @click="changeToDark"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>

                <div>Dark</div>
              </div>
            </div>
          </div>
          <!-- 主题切换 -->
          <!-- 用户 -->
          <div class="mb-3 flex items-center justify-between space-x-3 px-2">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="h-10 w-10 rounded-full">
                  <img src="../assets/zhouzhou.jpeg" />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-md font-bold">Roy</div>
                <div class="text-sm text-base-content">Admin Account</div>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-6 w-6 hover:fill-slate-600"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <!-- 用户 -->
        </div>
      </ul>
    </div>
  </div>
</template>
