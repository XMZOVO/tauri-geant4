<template>
  <div class="flex h-screen bg-dark-800 font-sans">
    <!-- 导航栏 -->
    <div class="flex flex-col py-3 w-52 justify-between items-center bg-card">
      <div class="items-center w-full">
        <!-- App标题 -->
        <div
          :class="[
            'flex items-center justify-center gap-3 pb-5 cursor-default text-txt',
          ]"
          @click="titleClick"
        >
          <div class="i-carbon-chart-bubble-packed w-10 h-10"></div>
          <div class="select-none text-2xl">TauriG4</div>
        </div>
        <!-- 导航 -->
        <div class="relative">
          <!-- item背景 -->
          <div
            class="item-bg absolute h-1/4 top-0 rounded-xl rounded-r-none z-0 bg-back w-11/12 right-0 scale-x-100"
          ></div>
          <div
            class="item flex flex-col gap-3 w-full ml-3 text-txt relative overflow-hidden z-50"
            v-for="(item, index) in navigatioBarItems"
          >
            <div
              :class="[
                'py-3 px-3 flex items-center gap-3 justify-start cursor-pointer rounded-xl bg-opacity-0 rounded-r-none',
              ]"
              @click="navToPage(index)"
            >
              <div
                :class="[
                  'w-5 h-5 transition-opacity duration-500',
                  item.icon,
                  activeBarItem == index
                    ? 'opacity-100 text-txt'
                    : 'opacity-60 text-txt',
                ]"
              ></div>
              <div
                :class="[
                  'transition-opacity duration-500',
                  activeBarItem == index
                    ? 'opacity-100 text-txt'
                    : 'opacity-60 text-txt',
                ]"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 用户 -->
      <div class="text-center">
        <!-- 用户 -->
        <div
          v-show="isLogin"
          class="flex items-center justify-between space-x-3 px-2 pt-3 border-t border-back text-txt"
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

interface itemTL {
  name: any;
  tl: any;
}

onMounted(() => {
  // const items = document.querySelector(".item-bg");
  const tlList: any[] = [];

  gsap.defaults({ duration: 0.3, ease: "power2.inOut" });

  // items.forEach(function (item, index) {
  //   const tl = gsap
  //     .timeline({ paused: true })
  //     .to(item.querySelector(".item-bg"), {
  //       scaleX: 1,
  //       transformOrigin: "100%",
  //     });
  //   tlList.push({ name: item, tl: tl });
  //   item.addEventListener("mousedown", () => {
  //     tlList.forEach((ot) => {
  //       if (ot.name != item) {
  //         ot.tl.reverse();
  //       } else {
  //         tl.play();
  //       }
  //     });
  //   });
  //   // item.addEventListener("mouseleave", () => tl.reverse());
  // });
});

const navToPage = (index: number) => {
  const itembg = document.querySelector(".item-bg");
  gsap.to(itembg, { y: index.toString() + "00%" });

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
