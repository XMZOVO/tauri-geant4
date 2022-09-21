<template>
  <div class="flex h-screen bg-light-50">
    <!-- 导航栏 -->
    <div
      class="flex flex-col w-52 justify-between items-center border-r border-gray-200"
    >
      <div class="flex flex-col items-center w-full">
        <!-- App标题 -->
        <div
          :class="[
            'flex items-center gap-3 pb-5 cursor-default',
            activeTitle ? 'animate-rubber-band animate-duration-500' : '',
          ]"
          @click="titleClick"
        >
          <div class="i-carbon-chart-bubble-packed w-10 h-10"></div>
          <div class="select-none text-2xl font-mono">TauriG4</div>
        </div>
        <!-- 导航 -->
        <div
          class="flex flex-col gap-3 w-full"
          v-for="(item, index) in navigatioBarItems"
        >
          <div
            :class="[
              activeBarItem == index
                ? 'bg-black animate-bounce-in animate-duration-500'
                : 'hover:bg-gray-200',
              'py-3 px-3 flex items-center gap-3 justify-start cursor-pointer rounded-xl transition duration-300 ',
            ]"
            @click="navToPage(index)"
          >
            <div
              :class="[
                'w-5 h-5',
                item.icon,
                activeBarItem == index
                  ? 'opacity-100 text-white '
                  : 'opacity-60 text-black',
              ]"
            ></div>
            <div
              :class="[
                'font-sans',
                activeBarItem == index
                  ? 'opacity-100 text-white'
                  : 'opacity-60',
              ]"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- 用户 -->
      <div class="text-center">
        <!-- 用户 -->
        <div
          v-show="isLogin"
          class="my-3 flex items-center justify-between space-x-3 px-2"
          :class="{
            ' animate-bounce-out-left animate-duration-1000': activeLogout,
          }"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 rounded-full relative">
              <img
                src="../assets/zhouzhou.jpeg"
                class="w-10 h-10 rounded-full"
              />
            </div>
            <div class="flex flex-col text-start">
              <div class="text-sm font-bold font-sans">Roy</div>
              <div class="text-sm text-base-content font-sans opacity-60">
                Admin Account
              </div>
            </div>
          </div>
          <div
            class="i-carbon-logout h-5 w-5 hover:opacity-60 cursor-pointer"
            @click="logoutClick"
          ></div>
        </div>
      </div>
    </div>
    <!-- 内容栏 -->
    <div class="w-full overflow-hidden">
      <router-view v-slot="{ Component }">
        <!-- <transition
          class="animate-duration-300"
          enter-active-class="animate-slide-in-down"
          leave-active-class="animate-slide-out-down"
          mode="out-in"
        > -->
        <component :is="Component" />
        <!-- </transition> -->
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
let activeBarItem = $ref(0);
let activeTitle = $ref(false);
let activeLogout = $ref(false);
let isLogin = $ref(true);
const navigatioBarItems = $ref([
  {
    name: "主页",
    icon: "i-carbon-home",
    path: "/",
  },
  {
    name: "概览",
    icon: "i-carbon-chart-rose",
    path: "/Overview",
  },
  {
    name: "结果",
    icon: "i-carbon-result",
    path: "/Results",
  },
  {
    name: "设置",
    icon: "i-carbon-settings",
    path: "/Setting",
  },
  {
    name: "Test",
    icon: "i-carbon-3d-mpr-toggle",
    path: "/Test",
  },
]);
const navToPage = (index: number) => {
  router.push(navigatioBarItems[index].path);
  activeBarItem = index;
};
const titleClick = () => {
  activeTitle = true;
  setTimeout(() => {
    activeTitle = false;
  }, 1000);
};
const logoutClick = () => {
  activeLogout = true;
  setTimeout(() => {
    isLogin = false;
  }, 1000);
};
</script>
