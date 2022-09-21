<template>
  <div class="flex h-screen bg-dark-800 font-sans">
    <!-- 导航栏 -->
    <div
      class="flex flex-col py-3 w-52 justify-between items-center bg-dark-200"
    >
      <div class="items-center w-full">
        <!-- App标题 -->
        <div
          :class="[
            'flex items-center justify-center gap-3 pb-5 cursor-default text-light-800',
            activeTitle ? 'animate-rubber-band animate-duration-500' : '',
          ]"
          @click="titleClick"
        >
          <div class="i-carbon-chart-bubble-packed w-10 h-10"></div>
          <div class="select-none text-2xl">TauriG4</div>
        </div>
        <!-- 导航 -->
        <div
          class="flex flex-col gap-3 w-full ml-3 text-light-800"
          v-for="(item, index) in navigatioBarItems"
        >
          <div
            :class="[
              activeBarItem == index
                ? 'bg-dark-800 animate-bounce-in animate-duration-500 '
                : '',
              ' py-3 px-3 flex items-center gap-3 justify-start cursor-pointer rounded-xl rounded-r-none transition duration-300 ',
            ]"
            @click="navToPage(index)"
          >
            <div class="min-w-1 bg-white h-full scale-y-0">1</div>
            <div
              :class="[
                'w-5 h-5',
                item.icon,
                activeBarItem == index
                  ? 'opacity-100 text-light-800'
                  : 'opacity-60 text-light-800',
              ]"
            ></div>
            <div
              :class="[
                '',
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
          class="flex items-center justify-between space-x-3 px-2 pt-3 border-t border-dark-800 text-light-800 bg-dark-200"
          :class="{
            ' animate-bounce-out-left animate-duration-1000': activeLogout,
          }"
        >
          <div class="flex items-center gap-2">
            <div class="w-10 rounded-full relative">
              <img
                src="../assets/zhouzhou.jpeg"
                class="w-10 h-10 rounded-full"
              />
            </div>
            <div class="flex flex-col text-start">
              <div class="text-sm font-bold">Roy</div>
              <div class="text-xs text-base-content opacity-60">
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
      <router-view></router-view>
      <!-- <router-view v-slot="{ Component }"> -->
      <!-- <transition
          class="animate-duration-300"
          enter-active-class="animate-slide-in-down"
          leave-active-class="animate-slide-out-down"
          mode="out-in"
        > -->
      <!-- <component :is="Component" /> -->
      <!-- </transition> -->
      <!-- </router-view> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

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
  // {
  //   name: "Test",
  //   icon: "i-carbon-3d-mpr-toggle",
  //   path: "/Test",
  // },
]);

onMounted(() => {
  // const items = document.querySelectorAll(".item");
  // console.log(items);
  // gsap.defaults({ duration: 0.3 });
  // items.forEach(function (item, index) {
  //   const tl = gsap
  //     .timeline({ paused: true })
  //     .to(item.querySelector(".bar1")?.querySelector(".bar2")!, {
  //       scaleY: 1,
  //       transformOrigin: "bottom",
  //     });
  //   item.addEventListener("mouseenter", () => {
  //     console.log(1);
  //     tl.play();
  //   });
  //   item.addEventListener("mouseleave", () => tl.reverse());
  // });
});

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
