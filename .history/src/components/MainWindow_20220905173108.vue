<template>
  <div class="drawer-mobile drawer h-screen">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Page content here -->
      <!-- <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
        >Open drawer</label
      > -->
      <router-view></router-view>
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
          <li>
            <a :class="{ active: isActive == 0 }" @click="homePageClick">
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
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </span>
              <span class="flex-1">主页</span></a
            >
          </li>
          <li>
            <a :class="{ active: isActive == 1 }" @click="dashboardClick">
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
                    d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                  />
                </svg>
              </span>
              <span class="flex-1">概览</span>
            </a>
          </li>
          <li>
            <a :class="{ active: isActive == 2 }" @click="settingClick">
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
              <span class="flex-1">设置</span>
            </a>
          </li>
          <!-- 导航栏 -->
        </div>
        <div class="flex flex-col">
          <div class="divider"></div>
          <div class="flex items-center justify-between pb-5">
            <div class="flex items-center space-x-3">
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              <label class="font-bold">帮助与教程</label>
            </div>
            <div class="badge badge-secondary">+99</div>
          </div>
          <div class="rounded-full bg-base-300">
            <div class="flex p-2">
              <div class="flex bg-base-100">
                <div>1</div>
                <div>Light</div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { defineStore } from "pinia";

const router = useRouter();
const isActive = ref(0);

onBeforeRouteUpdate((to, from) => {
  if (to.fullPath == "/Overview") {
    isActive.value = 1;
  }
});

const homePageClick = () => {
  isActive.value = 0;
  router.push({ path: "/" });
};

const dashboardClick = () => {
  isActive.value = 1;
  router.push({ path: "/Overview" });
};

const settingClick = () => {
  isActive.value = 2;
  router.push({ path: "/Setting" });
};

function setIsActiveIndex(index: number) {
  isActive.value = index;
  alert("w");
}
</script>
